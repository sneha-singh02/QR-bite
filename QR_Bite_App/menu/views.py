from django.shortcuts import render, get_object_or_404, redirect
from .models import Dish
from .utils import send_otp_via_email

import random
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.core.mail import send_mail
from .forms import SignUpForm, LoginForm
from .models import Profile
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib import messages

# Simple cart logic using session (for now)




def send_otp(request, mobile_number):
    otp = random.randint(100000, 999999)  # Generate a 6-digit OTP
    request.session['otp'] = otp  # Store OTP in the session for later verification
    request.session['mobile_number'] = mobile_number  # Store the mobile number in the session

    # Send OTP via email (You can change this to SMS logic if required)
    send_otp_via_email(mobile_number,otp)
    print('OTP_Sent_Done')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            mobile_number = form.cleaned_data['mobile_number']
            email = form.cleaned_data.get('email', '')
            name = form.cleaned_data.get('name', 'User')
            # Check if the mobile number already exists in the database
            if Profile.objects.filter(mobile_number=mobile_number).exists():
                return redirect('login')  # Redirect to login page if the user exists
            user = User.objects.create_user(username=mobile_number, email=email)
            # Create a new user profile
            profile = form.save(commit=False)
            profile.user = user  # No user is linked at the moment
            profile.save()
            
            # Send OTP to new user
            send_otp(request, mobile_number)
            return redirect('verify_otp')
    else:
        form = SignUpForm()

    return render(request, 'menu/signup.html', {'form': form})



def login(request):
    otp_sent = False
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():

            mobile_number = form.cleaned_data['mobile_number']
            #print(mobile_number)
            # Check if the mobile number exists
            try:
                profile = Profile.objects.get(mobile_number=mobile_number)
                print(profile)
            except Profile.DoesNotExist:
                return redirect('signup')  # Redirect to signup if the mobile number doesn't exist

            # Send OTP for login
            send_otp(request, mobile_number)
            otp_sent = True
            return redirect('verify_otp')
    else:
        form = LoginForm()

    return render(request, 'menu/login.html', {'form': form, 'otp_sent': otp_sent})


# OTP Verification
def verify_otp(request):
    if request.method == 'POST':
        otp = request.POST.get('otp')
        session_otp = str(request.session.get('otp'))
        mobile_number = request.session.get('mobile_number')

        if otp == session_otp:
            try:
                profile = Profile.objects.get(mobile_number=mobile_number)
            except Profile.DoesNotExist:
                return redirect('signup')

            # ✅ Save info in session
            request.session['logged_in'] = True
            request.session['user_name'] = profile.name
            request.session['mobile_number'] = mobile_number

            messages.success(request, "You have logged in successfully!")
            return redirect('dish_list')  # menu page
        else:
            return render(request, 'menu/otp_verification.html', {'error': 'Invalid OTP'})

    return render(request, 'menu/otp_verification.html')





def dish_list(request):
    dishes = Dish.objects.all()
    categories = Dish.objects.values_list('category', flat=True).distinct()
    context = {
        'dishes': dishes,
        'categories': categories,
        'user_name': request.session.get('user_name', 'Guest'),
        'logged_in': request.session.get('logged_in', False),
    }
    return render(request, 'menu/menu.html', context)


def logout_view(request):
    request.session.flush()
    messages.success(request, "You have been logged out.")
    return redirect('dish_list')



def menu_view(request):
    dishes = Dish.objects.all()
    return render(request, 'menu/menu.html', {'dishes': dishes})


def order_summary(request):
    context = {
        'user_name': request.session.get('user_name', 'Guest'),
        'logged_in': request.session.get('logged_in', False),
    }

    return render(request, 'menu/order_summary.html',context)





def add_to_cart(request, dish_id):
    cart = request.session.get('cart', [])
    cart.append(dish_id)
    request.session['cart'] = cart
    return redirect('cart')

def cart_view(request):
    cart = request.session.get('cart', [])
    dishes = Dish.objects.filter(id__in=cart)
    total = sum(dish.price for dish in dishes)
    return render(request, 'menu/cart.html', {'dishes': dishes, 'total': total})

def confirm_order(request):
    request.session['cart'] = []  # Clear cart
    return render(request, 'menu/order_confirm.html')

#OR code Below

# import qrcode
# from django.http import HttpResponse
# from io import BytesIO

# def generate_qr(request):
#     url = request.build_absolute_uri('/menu/')  # or your menu page URL
#     qr = qrcode.make(url)
#     buffer = BytesIO()
#     qr.save(buffer, format="PNG")
#     return HttpResponse(buffer.getvalue(), content_type="image/png")

