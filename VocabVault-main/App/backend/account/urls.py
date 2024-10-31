from django.urls import path
from . import views

urlpatterns = [
    path('api/register/', views.register, name='register'),
    path('api/me/', views.currentUser, name='current_user'),
    path('api/me/update', views.updateUser, name='update_user'),
    path('account/postAccGoals', views.setUserGoals, name='account'),
    # path('account/getAccGoals', views.getUserGoals, name='account'),
    path('account/setAccStats', views.setUserGoals, name='setGoals'),
]