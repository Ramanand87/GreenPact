from django.db import models
from user.models import CustomUser
from uuid import uuid4

class Rating(models.Model):
    RATING_CHOICES = [
        (1,'1'), 
        (2,'2'), 
        (3,'3'), 
        (4,'4'), 
        (5,'5'), 
    ]
    id=models.UUIDField(default=uuid4,primary_key=True,editable=False)
    rated_user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="received_ratings")
    rating_user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name="given_ratings")
    description=models.TextField(blank=True)
    rate=models.IntegerField(choices=RATING_CHOICES)

    def __str__(self):
        return f'{self.rating_user.username} rated {self.rated_user.username}'
    
class RatingImage(models.Model):
    id=models.UUIDField(default=uuid4,primary_key=True,editable=False)
    rating=models.ForeignKey(Rating,on_delete=models.CASCADE,related_name="rating_images")
    image=models.ImageField(upload_to='rating/image/')

    def __str__(self):
        return f'Image for rating {self.rating.id}'


