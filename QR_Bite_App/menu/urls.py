from django.urls import path
from django.contrib import admin
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.dish_list, name='dish_list'),
    # path('', views.dish_list, name='menu'),

    path('order_summary/', views.order_summary, name='order_summary'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('verify_otp/', views.verify_otp, name='verify_otp'),
    path('logout/', views.logout_view, name='logout'),

]