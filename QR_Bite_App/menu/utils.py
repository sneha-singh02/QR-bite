# menu/utils.py


from django.core.mail import send_mail
from django.conf import settings
from .models import Profile

def send_otp_via_email(mobile_number, otp):
    try:
        # Get the user's registered email using the mobile number
        profile = Profile.objects.get(mobile_number=mobile_number)
        recipient = profile.email
    except Profile.DoesNotExist:
        return  # If no profile found, don’t attempt to send email

    subject = "Your OTP for QR Bite Login"
    message = f"Hello {profile.name},\n\nYour OTP for logging into QR Bite is: {otp}\n\nThank you!"

    try:
        send_mail(subject, message, settings.EMAIL_HOST_USER, [recipient])
        return 'Success'
    except Exception as e:
        return 'fail'
    
