from django.db.models import Q
from rest_framework import viewsets, permissions
from .models import Complaint
from .serializers import ComplaintSerializer


class IsAdminOrOwner(permissions.BasePermission):
    """
    Admins can do anything.
    Normal users can only see complaints where they are
    complainant or accused.
    """

    def has_object_permission(self, request, view, obj: Complaint):
        if request.user.is_staff:
            return True
        return obj.complainant == request.user or obj.accused == request.user


class ComplaintViewSet(viewsets.ModelViewSet):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        qs = Complaint.objects.select_related("complainant", "accused")

        # Admins see everything
        if user.is_staff:
            return qs.order_by("-created_at")

        # Normal users see complaints they filed or where they’re accused
        return qs.filter(
            Q(complainant=user) | Q(accused=user)
        ).order_by("-created_at")

    def perform_create(self, serializer):
        # Force complainant to be the logged-in user
        serializer.save(complainant=self.request.user)

    def perform_update(self, serializer):
        """
        - Admins can update everything (status, admin_notes, etc.)
        - Normal users can only edit their own description, proof, etc.
        """
        user = self.request.user

        if not user.is_staff:
            # Remove protected fields for non-admins
            protected_fields = ["status", "admin_notes", "complainant", "accused"]
            for field in protected_fields:
                serializer.validated_data.pop(field, None)

        serializer.save()
