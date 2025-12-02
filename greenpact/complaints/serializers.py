from rest_framework import serializers
from .models import Complaint
from user.models import CustomUser

class ComplaintSerializer(serializers.ModelSerializer):
    # Read-only fields
    complainant = serializers.ReadOnlyField(source="complainant.username")
    accused = serializers.SlugRelatedField(
        slug_field='username',
        queryset=CustomUser.objects.all(),
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
