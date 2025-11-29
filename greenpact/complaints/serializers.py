from rest_framework import serializers
from .models import Complaint
from user.models import CustomUser

class ComplaintSerializer(serializers.ModelSerializer):
    # Read-only fields
    complainant = serializers.ReadOnlyField(source="complainant.username")
    accused = serializers.ReadOnlyField(source="accused.username")

    # Write-only helper to set accused by username (optional)
    accused_username = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        help_text="Username of the user you are complaining against"
    )

    class Meta:
        model = Complaint
        fields = "__all__"

    def validate(self, attrs):
        request = self.context.get("request")

        # Convert accused_username -> accused object
        accused_username = attrs.pop("accused_username", None)
        if accused_username:
            try:
                accused_user = CustomUser.objects.get(username=accused_username)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError(
                    {"accused_username": "No user found with this username."}
                )
            attrs["accused"] = accused_user

        # Prevent self-complaint
        if request and request.user.is_authenticated:
            if attrs.get("accused") == request.user:
                raise serializers.ValidationError(
                    "You cannot file a complaint against yourself."
                )

        return attrs
