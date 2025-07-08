import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileContext } from '../../context/ProfileContext';
import {
  FiUser, FiPhone, FiMapPin, FiLock, FiClock, FiCamera,
  FiSave, FiX, FiCheck, FiEye, FiEyeOff, FiSend, FiAward,
  FiTarget, FiHome, FiEdit2, FiAlertCircle, FiChevronRight,
  FiMail,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { FaTshirt } from 'react-icons/fa';

const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 800;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with 0.7 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const toastStyles = {
  success: {
    duration: 2000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(to right, #10B981, #059669)',
      color: '#fff',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      maxWidth: '400px',
    },
    icon: '🎉',
    iconTheme: {
      primary: '#fff',
      secondary: '#059669',
    },
  },
  error: {
    duration: 3000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(to right, #EF4444, #DC2626)',
      color: '#fff',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      maxWidth: '400px',
    },
    icon: '❌',
    iconTheme: {
      primary: '#fff',
      secondary: '#DC2626',
    },
  },
  warning: {
    duration: 3000,
    position: 'top-right',
    style: {
      background: 'linear-gradient(to right, #F59E0B, #D97706)',
      color: '#fff',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      maxWidth: '400px',
    },
    icon: '⚠️',
    iconTheme: {
      primary: '#fff',
      secondary: '#D97706',
    },
  }
};

// Add this at the top of the file, after the imports
const countryStates = {
  'Tunisia': [
    'Tunis',
    'Ariana',
    'Ben Arous',
    'Manouba',
    'Nabeul',
    'Zaghouan',
    'Bizerte',
    'Béja',
    'Jendouba',
    'Kef',
    'Siliana',
    'Sousse',
    'Monastir',
    'Mahdia',
    'Sfax',
    'Kairouan',
    'Kasserine',
    'Sidi Bouzid',
    'Gabès',
    'Medenine',
    'Tataouine',
    'Gafsa',
    'Tozeur',
    'Kebili'
  ],
  'France': [
    'Île-de-France',
    'Auvergne-Rhône-Alpes',
    'Hauts-de-France',
    'Provence-Alpes-Côte d\'Azur',
    'Occitanie',
    'Nouvelle-Aquitaine',
    'Grand Est',
    'Pays de la Loire',
    'Bretagne',
    'Normandie',
    'Bourgogne-Franche-Comté',
    'Centre-Val de Loire',
    'Corse'
  ],
  'Algeria': [
    'Alger',
    'Oran',
    'Constantine',
    'Annaba',
    'Blida',
    'Batna',
    'Djelfa',
    'Sétif',
    'Sidi Bel Abbès',
    'Skikda',
    'Tlemcen',
    'Tizi Ouzou',
    'El Oued',
    'Jijel',
    'Mostaganem',
    'M\'Sila',
    'Ouargla',
    'Tébessa',
    'Tiaret',
    'Tlemcen'
  ],
  'Morocco': [
    'Casablanca',
    'Rabat',
    'Fès',
    'Marrakech',
    'Tanger',
    'Agadir',
    'Meknès',
    'Oujda',
    'Kénitra',
    'Tétouan',
    'Salé',
    'Nador',
    'Mohammedia',
    'El Jadida',
    'Béni Mellal',
    'Taza',
    'Khouribga',
    'Settat',
    'Larache',
    'Ksar El Kébir'
  ]
};

const Settings = () => {
  const navigate = useNavigate();
  const { profileData, updateProfileData, updatePersonalInfo, updateAcademyInfo } = useProfileContext();
  const [formData, setFormData] = useState(profileData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isImageUpdating, setIsImageUpdating] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Phone verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationStep, setVerificationStep] = useState('phone');
  const [countdown, setCountdown] = useState(0);

  // Age groups options
  const ageGroupOptions = [
    'Ecol (U5–U8)', 'Junior (U9–U12)', 'Youth (U13–U16)', 'Senior Youth (U17–U19)', 'Adult (+18)'];

  // North African countries
  const northAfricanCountries = [
    { value: 'TN', label: 'Tunisia' },
    { value: 'DZ', label: 'Algeria' },
    { value: 'MA', label: 'Morocco' },
    { value: 'LY', label: 'Libya' },
    { value: 'EG', label: 'Egypt' },
    { value: 'MR', label: 'Mauritania' }
  ];

  // Update formData when profileData changes
  useEffect(() => {
    setFormData(profileData);
    setIsLoading(false);
  }, [profileData]);

  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add highlight effect
      element.classList.add('highlight-error');
      setTimeout(() => {
        element.classList.remove('highlight-error');
      }, 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const hasChanges = () => {
    // Deep comparison of form data with original profile data
    const formDataString = JSON.stringify({
      personalInfo: formData.personalInfo,
      location: formData.location,
      academyInfo: formData.academyInfo,
      preferences: {
        timezone: formData.preferences.timezone,
        languages: formData.preferences.languages || ['en']
      }
    });
    const profileDataString = JSON.stringify({
      personalInfo: profileData.personalInfo,
      location: profileData.location,
      academyInfo: profileData.academyInfo,
      preferences: {
        timezone: profileData.preferences.timezone,
        languages: profileData.preferences.languages || ['en']
      }
    });
    return formDataString !== profileDataString;
  };

  const validateForm = async () => {
    // Personal Info validation
    if (!formData.personalInfo.fullName?.trim()) {
      scrollToElement('fullName');
      await new Promise(resolve => {
        toast.error('Full name is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    if (!formData.personalInfo.email?.trim()) {
      scrollToElement('email');
      await new Promise(resolve => {
        toast.error('Email is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalInfo.email)) {
      scrollToElement('email');
      await new Promise(resolve => {
        toast.error('Invalid email format', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    if (!formData.personalInfo.phone?.trim()) {
      scrollToElement('phone');
      await new Promise(resolve => {
        toast.error('Phone number is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    // Location validation
    if (!formData.location.country) {
      scrollToElement('country');
      await new Promise(resolve => {
        toast.error('Country is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    if (!formData.location.city?.trim()) {
      scrollToElement('city');
      await new Promise(resolve => {
        toast.error('City is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    // Academy Info validation
    if (!formData.academyInfo.name?.trim()) {
      scrollToElement('academyName');
      await new Promise(resolve => {
        toast.error('Academy name is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    if (!formData.academyInfo.founded?.trim()) {
      scrollToElement('founded');
      await new Promise(resolve => {
        toast.error('Founded year is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    if (!formData.academyInfo.country) {
      scrollToElement('academyCountry');
      await new Promise(resolve => {
        toast.error('Academy country is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    if (!formData.academyInfo.city?.trim()) {
      scrollToElement('academyCity');
      await new Promise(resolve => {
        toast.error('Academy city is required', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: 'linear-gradient(to right, #EF4444, #DC2626)',
            color: '#fff',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          icon: '❌',
          iconTheme: {
            primary: '#fff',
            secondary: '#DC2626',
          },
        });
        setTimeout(resolve, 2000);
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // First check if there are any changes
    if (!hasChanges()) {
      toast('No changes to save', {
        ...toastStyles.warning,
        icon: 'ℹ️'
      });
      return;
    }

    // If there are changes, proceed with validation
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    // If validation passes, proceed with submission
    setIsSubmitting(true);
    try {
      // Ensure preferences are properly structured
      const updatedData = {
        ...formData,
        preferences: {
          timezone: formData.preferences.timezone,
          languages: formData.preferences.languages || ['en']
        }
      };

      await updateProfileData(updatedData);

      // On successful update
      scrollToTop();
      toast.success('Settings updated successfully!', toastStyles.success);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update settings', toastStyles.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload with validation
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Please upload an image file'
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'Image size should be less than 5MB'
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        profileImage: reader.result
      }));
      setErrors(prev => ({
        ...prev,
        image: null
      }));
    };
    reader.readAsDataURL(file);
  };

  // Handle phone verification with improved UX
  const handlePhoneVerification = async () => {
    if (!formData.personalInfo.phone?.trim()) {
      setErrors(prev => ({
        ...prev,
        phone: 'Please enter a phone number first'
      }));
      return;
    }

    setIsSendingCode(true);
    try {
      // Simulate API call to send verification code
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowVerificationModal(true);
      setVerificationStep('code');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error sending verification code:', error);
      setErrors(prev => ({
        ...prev,
        phone: 'Failed to send verification code. Please try again.'
      }));
    } finally {
      setIsSendingCode(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert('Please enter the verification code');
      return;
    }

    try {
      // Simulate API call to verify code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          isPhoneVerified: true
        }
      }));
      setShowVerificationModal(false);
      setVerificationCode('');
      setVerificationStep('phone');
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Invalid verification code. Please try again.');
    }
  };

  // Handle age group selection
  const handleAgeGroupChange = (ageGroup) => {
    setFormData(prev => ({
      ...prev,
      academyInfo: {
        ...prev.academyInfo,
        ageGroups: prev.academyInfo.ageGroups.includes(ageGroup)
          ? prev.academyInfo.ageGroups.filter(group => group !== ageGroup)
          : [...prev.academyInfo.ageGroups, ageGroup]
      }
    }));
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isImageUpdating) {
      toast.error('Please wait for the current image update to complete', toastStyles.error);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        profileImage: 'Please upload an image file'
      }));
      toast.error('Please upload a valid image file', toastStyles.error);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        profileImage: 'Image size should be less than 5MB'
      }));
      toast.error('Image size should be less than 5MB', toastStyles.error);
      return;
    }

    setIsImageUpdating(true);
    try {
      const compressedImage = await compressImage(file);

      // Update context first
      await updatePersonalInfo({ profileImage: compressedImage });

      // Then update local state
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          profileImage: compressedImage
        }
      }));

      toast.success('Profile picture updated successfully!', toastStyles.success);
      setErrors(prev => ({
        ...prev,
        profileImage: null
      }));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        toast.error('Storage limit exceeded. Image will be displayed but not saved.', toastStyles.warning);
      } else {
        console.error('Error processing image:', error);
        toast.error('Failed to process profile picture', toastStyles.error);
      }
    } finally {
      setIsImageUpdating(false);
    }
  };

  const handleAcademyLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isImageUpdating) {
      toast.error('Please wait for the current image update to complete', toastStyles.error);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        academyLogo: 'Please upload an image file'
      }));
      toast.error('Please upload a valid image file', toastStyles.error);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        academyLogo: 'Image size should be less than 5MB'
      }));
      toast.error('Image size should be less than 5MB', toastStyles.error);
      return;
    }

    setIsImageUpdating(true);
    try {
      const compressedLogo = await compressImage(file);

      // Update context first
      await updateAcademyInfo({ logo: compressedLogo });

      // Then update local state
      setFormData(prev => ({
        ...prev,
        academyInfo: {
          ...prev.academyInfo,
          logo: compressedLogo
        }
      }));

      toast.success('Academy logo updated successfully!', toastStyles.success);
      setErrors(prev => ({
        ...prev,
        academyLogo: null
      }));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        toast.error('Storage limit exceeded. Logo will be displayed but not saved.', toastStyles.warning);
      } else {
        console.error('Error processing logo:', error);
        toast.error('Failed to process academy logo', toastStyles.error);
      }
    } finally {
      setIsImageUpdating(false);
    }
  };

  const handleHomeKitUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isImageUpdating) {
      toast.error('Please wait for the current image update to complete', toastStyles.error);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file', toastStyles.error);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', toastStyles.error);
      return;
    }

    setIsImageUpdating(true);
    try {
      const compressedImage = await compressImage(file);

      setFormData(prev => ({
        ...prev,
        academyInfo: {
          ...prev.academyInfo,
          tenues: {
            ...prev.academyInfo.tenues,
            homeKit: compressedImage
          }
        }
      }));

      toast.success('Home kit updated successfully!', toastStyles.success);
    } catch (error) {
      console.error('Error processing kit image:', error);
      toast.error('Failed to process kit image', toastStyles.error);
    } finally {
      setIsImageUpdating(false);
    }
  };

  const handleAwayKitUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isImageUpdating) {
      toast.error('Please wait for the current image update to complete', toastStyles.error);
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file', toastStyles.error);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB', toastStyles.error);
      return;
    }

    setIsImageUpdating(true);
    try {
      const compressedImage = await compressImage(file);

      setFormData(prev => ({
        ...prev,
        academyInfo: {
          ...prev.academyInfo,
          tenues: {
            ...prev.academyInfo.tenues,
            awayKit: compressedImage
          }
        }
      }));

      toast.success('Away kit updated successfully!', toastStyles.success);
    } catch (error) {
      console.error('Error processing kit image:', error);
      toast.error('Failed to process kit image', toastStyles.error);
    } finally {
      setIsImageUpdating(false);
    }
  };

  // Add this function inside the Settings component
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setFormData(prev => ({
      ...prev,
      country: newCountry,
      state: '' // Reset state when country changes
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px 20px',
            color: '#fff',
            background: '#1F2937',
            backdropFilter: 'blur(10px)',
            maxWidth: '400px',
          },
          success: {
            duration: 4000,
            style: {
              background: 'linear-gradient(to right, #10B981, #059669)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: 'linear-gradient(to right, #EF4444, #DC2626)',
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#DC2626',
            },
          },
        }}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        containerClassName="toast-container"
      />

      <div className="fixed left-72 top-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-r-2xl shadow-lg p-4 space-y-2">
          <a
            href="#personal-info"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all duration-300 text-gray-700 border border-indigo-100 hover:border-indigo-200 shadow-sm hover:shadow-md min-w-[200px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="p-2 rounded-lg bg-white group-hover:bg-indigo-50 transition-colors relative z-10">
              <FiUser className="text-indigo-500 text-xl group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col relative z-10">
              <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">Administration Information</span>
              <span className="text-xs text-gray-500 group-hover:text-gray-600">Update your details</span>
            </div>
            <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FiChevronRight className="text-indigo-500" />
            </div>
          </a>

          <a
            href="#location"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 text-gray-700 border border-green-100 hover:border-green-200 shadow-sm hover:shadow-md min-w-[200px]"
          >
            <div className="p-2 rounded-lg bg-white group-hover:bg-green-50 transition-colors">
              <FiMapPin className="text-green-500 text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Location Details</span>
              <span className="text-xs text-gray-500">Manage address</span>
            </div>
          </a>

          <a
            href="#academy"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300 text-gray-700 border border-purple-100 hover:border-purple-200 shadow-sm hover:shadow-md min-w-[200px]"
          >
            <div className="p-2 rounded-lg bg-white group-hover:bg-purple-50 transition-colors">
              <FiTarget className="text-purple-500 text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Academy Info</span>
              <span className="text-xs text-gray-500">Configure settings</span>
            </div>
          </a>

          <a
            href="#preferences"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 text-gray-700 border border-amber-100 hover:border-amber-200 shadow-sm hover:shadow-md min-w-[200px]"
          >
            <div className="p-2 rounded-lg bg-white group-hover:bg-amber-50 transition-colors">
              <FiClock className="text-amber-500 text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Preferences</span>
              <span className="text-xs text-gray-500">Set preferences</span>
            </div>
          </a>

          <a
            href="#privacy"
            className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-all duration-300 text-gray-700 border border-red-100 hover:border-red-200 shadow-sm hover:shadow-md min-w-[200px]"
          >
            <div className="p-2 rounded-lg bg-white group-hover:bg-red-50 transition-colors">
              <FiLock className="text-red-500 text-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Privacy & Security</span>
              <span className="text-xs text-gray-500">Security settings</span>
            </div>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-[240px]">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <div className="text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
              <FiEdit2 className="text-blue-500" />
              Account Settings
            </h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Manage your personal information, academy details, security settings, and preferences
            </p>
          </div>
          <div></div>
        </div>

        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl px-4 py-3 flex items-center bg-red-100 border border-red-400 text-red-700"
          >
            <FiAlertCircle className="mr-2" />
            <span>{Object.values(errors)[0]}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            id="academy-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
              <FiAward className="text-blue-500" />
              Academy Information
            </h2>

            {/* Academy Logo Section */}
            <div className="mb-10">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    <img
                      src={formData.academyInfo.logo || "https://via.placeholder.com/150"}
                      alt="Academy Logo"
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <label
                    htmlFor="academy-logo-upload"
                    className="absolute -bottom-3 right-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    <FiCamera className="text-xl" />
                  </label>
                  <input
                    type="file"
                    id="academy-logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAcademyLogoUpload}
                  />
                </div>
              </div>
              <p className="text-center mt-6 text-sm text-gray-500">
                Click the camera icon to update academy logo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academy Name
                  </label>
                  <input
                    type="text"
                    id="academyName"
                    name="academyInfo.name"
                    value={formData.academyInfo.name}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        academyInfo: {
                          ...prev.academyInfo,
                          name: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter academy name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      id="founded"
                      name="academyInfo.founded"
                      value={formData.academyInfo.founded}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            founded: e.target.value
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="e.g., 2010"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="academyCountry"
                      name="academyInfo.country"
                      value={formData.academyInfo.country}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            country: e.target.value
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select Country</option>
                      {northAfricanCountries.map(country => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="academyCity"
                    name="academyInfo.city"
                    value={formData.academyInfo.city}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        academyInfo: {
                          ...prev.academyInfo,
                          city: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter city"
                  />
                </div>
              </div>




              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements
                </label>
                <textarea
                  name="academyInfo.achievements"
                  value={formData.academyInfo.achievements}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      academyInfo: {
                        ...prev.academyInfo,
                        achievements: e.target.value
                      }
                    }));
                  }}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="List your academy's achievements"
                />
              </div>


              
              <div className="md:col-span-2 py-8 border-t border-gray-100">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <FiMapPin className="text-blue-500" />
                  Location Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      id="country"
                      name="location.country"
                      value={formData.location.country}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            country: e.target.value
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                      <option value="">Select Country</option>
                      {northAfricanCountries.map(country => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Region
                    </label>
                    <input
                      type="text"
                      name="location.state"
                      value={formData.location.state}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            state: e.target.value
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter state/region"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="location.city"
                      value={formData.location.city}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            city: e.target.value
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="location.postalCode"
                      value={formData.location.postalCode}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            postalCode: e.target.value
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter postal code"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="location.address"
                      value={formData.location.address}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            address: e.target.value
                          }
                        }));
                      }}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter your full address"
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Age Groups
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {ageGroupOptions.map(ageGroup => (
                    <label
                      key={ageGroup}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${formData.academyInfo.ageGroups.includes(ageGroup)
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.academyInfo.ageGroups.includes(ageGroup)}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            academyInfo: {
                              ...prev.academyInfo,
                              ageGroups: e.target.checked
                                ? [...prev.academyInfo.ageGroups, ageGroup]
                                : prev.academyInfo.ageGroups.filter(group => group !== ageGroup)
                            }
                          }));
                        }}
                        className="hidden"
                      />
                      <span className="font-medium">{ageGroup}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Kit Images Section */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-gray-100">
                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Home Kit
                  </label>
                  <div className="relative">
                    <div className="w-40 h-40 rounded-xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                      {formData.academyInfo.tenues?.homeKit ? (
                        <img
                          src={formData.academyInfo.tenues.homeKit}
                          alt="Home Kit"
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FaTshirt className="text-gray-400 text-3xl" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="home-kit-upload"
                      className="absolute -bottom-3 right-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                    >
                      <FiCamera className="text-xl" />
                    </label>
                    <input
                      type="file"
                      id="home-kit-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleHomeKitUpload}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Away Kit
                  </label>
                  <div className="relative">
                    <div className="w-40 h-40 rounded-xl overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                      {formData.academyInfo.tenues?.awayKit ? (
                        <img
                          src={formData.academyInfo.tenues.awayKit}
                          alt="Away Kit"
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FaTshirt className="text-gray-400 text-3xl" />
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="away-kit-upload"
                      className="absolute -bottom-3 right-1/2 translate-x-1/2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                    >
                      <FiCamera className="text-xl" />
                    </label>
                    <input
                      type="file"
                      id="away-kit-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAwayKitUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Director
                  </label>
                  <input
                    type="text"
                    name="academyInfo.staff.technicalDirector"
                    value={formData.academyInfo.staff.technicalDirector}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        academyInfo: {
                          ...prev.academyInfo,
                          staff: {
                            ...prev.academyInfo.staff,
                            technicalDirector: e.target.value
                          }
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter technical director's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Head Coach
                  </label>
                  <input
                    type="text"
                    name="academyInfo.staff.headCoach"
                    value={formData.academyInfo.staff.headCoach}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        academyInfo: {
                          ...prev.academyInfo,
                          staff: {
                            ...prev.academyInfo.staff,
                            headCoach: e.target.value
                          }
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter head coach's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fitness Coach
                  </label>
                  <input
                    type="text"
                    name="academyInfo.staff.fitnessCoach"
                    value={formData.academyInfo.staff.fitnessCoach}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        academyInfo: {
                          ...prev.academyInfo,
                          staff: {
                            ...prev.academyInfo.staff,
                            fitnessCoach: e.target.value
                          }
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter fitness coach's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Staff
                  </label>
                  <input
                    type="text"
                    name="academyInfo.staff.medicalStaff"
                    value={formData.academyInfo.staff.medicalStaff}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        academyInfo: {
                          ...prev.academyInfo,
                          staff: {
                            ...prev.academyInfo.staff,
                            medicalStaff: e.target.value
                          }
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Enter medical staff details"
                  />
                </div>
              </div>

              {/* FACILITIES SECTION */}
              <div className="md:col-span-2 py-8 border-t border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <FiHome className="text-blue-500" />
                  Facilities
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stadium Name
                    </label>
                    <input
                      type="text"
                      name="academyInfo.facilities.stadiumName"
                      value={formData.academyInfo.facilities.stadiumName || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            facilities: {
                              ...prev.academyInfo.facilities,
                              stadiumName: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter stadium name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stadium Location
                    </label>
                    <input
                      type="text"
                      name="academyInfo.facilities.stadiumLocation"
                      value={formData.academyInfo.facilities.stadiumLocation || ''}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            facilities: {
                              ...prev.academyInfo.facilities,
                              stadiumLocation: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter stadium location"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Gym Available</span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${formData.academyInfo.facilities.gym ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            facilities: {
                              ...prev.academyInfo.facilities,
                              gym: !prev.academyInfo.facilities.gym
                            }
                          }
                        }))}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.academyInfo.facilities.gym ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                      </button>
                      <span className="ml-3 text-gray-700">
                        {formData.academyInfo.facilities.gym ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Cafeteria Available</span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${formData.academyInfo.facilities.cafeteria ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            facilities: {
                              ...prev.academyInfo.facilities,
                              cafeteria: !prev.academyInfo.facilities.cafeteria
                            }
                          }
                        }))}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.academyInfo.facilities.cafeteria ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                      </button>
                      <span className="ml-3 text-gray-700">
                        {formData.academyInfo.facilities.cafeteria ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium text-gray-700">Dormitory Available</span>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${formData.academyInfo.facilities.dormitory ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            facilities: {
                              ...prev.academyInfo.facilities,
                              dormitory: !prev.academyInfo.facilities.dormitory
                            }
                          }
                        }))}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${formData.academyInfo.facilities.dormitory ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                      </button>
                      <span className="ml-3 text-gray-700">
                        {formData.academyInfo.facilities.dormitory ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 py-8 border-t border-gray-100">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <FiMail className="text-blue-500" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="academyInfo.contact.phone"
                      value={formData.academyInfo.contact.phone}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            contact: {
                              ...prev.academyInfo.contact,
                              phone: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter contact phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="academyInfo.contact.email"
                      value={formData.academyInfo.contact.email}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            contact: {
                              ...prev.academyInfo.contact,
                              email: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter contact email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="academyInfo.contact.facebook"
                      value={formData.academyInfo.contact.facebook}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            contact: {
                              ...prev.academyInfo.contact,
                              facebook: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter Facebook page URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="academyInfo.contact.instagram"
                      value={formData.academyInfo.contact.instagram}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            contact: {
                              ...prev.academyInfo.contact,
                              instagram: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter Instagram profile URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="academyInfo.contact.website"
                      value={formData.academyInfo.contact.website}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            contact: {
                              ...prev.academyInfo.contact,
                              website: e.target.value
                            }
                          }
                        }));
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Enter Website URL"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Academy Philosophy
                    </label>
                    <textarea
                      name="academyInfo.philosophy"
                      value={formData.academyInfo.philosophy}
                      onChange={(e) => {
                        setFormData(prev => ({
                          ...prev,
                          academyInfo: {
                            ...prev.academyInfo,
                            philosophy: e.target.value
                          }
                        }));
                      }}
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Describe your academy's philosophy and values"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            id="personal-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
              <FiUser className="text-blue-500" />
              Personal Information
            </h2>

            {/* Personal Profile Picture Section */}
            <div className="mb-8">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    <img
                      src={formData.personalInfo.profileImage || "https://via.placeholder.com/150"}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="personal-profile-upload"
                    className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                  >
                    <FiCamera className="text-xl" />
                  </label>
                  <input
                    type="file"
                    id="personal-profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                  />
                </div>
              </div>
              <p className="text-center mt-4 text-sm text-gray-500">
                Click the camera icon to update your profile picture
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="personalInfo.fullName"
                  value={formData.personalInfo.fullName}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        fullName: e.target.value
                      }
                    }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="personalInfo.email"
                  value={formData.personalInfo.email}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        email: e.target.value
                      }
                    }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="personalInfo.phone"
                    value={formData.personalInfo.phone}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          phone: e.target.value
                        }
                      }));
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                    placeholder="+216 12 345 678"
                  />
                  {formData.personalInfo.isPhoneVerified ? (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 flex items-center gap-1 text-sm">
                      <FiCheck size={16} /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePhoneVerification}
                      disabled={isSendingCode}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      {isSendingCode ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <>
                          <FiSend size={16} />
                          Verify
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Position
                </label>
                <input
                  type="text"
                  name="personalInfo.position"
                  value="Administration"
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition cursor-not-allowed"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Responsibilities
                </label>
                <textarea
                  name="personalInfo.responsibilities"
                  value={formData.personalInfo.responsibilities}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      personalInfo: {
                        ...prev.personalInfo,
                        responsibilities: e.target.value
                      }
                    }));
                  }}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Describe your responsibilities"
                />
              </div>
            </div>
          </motion.div>


          <motion.div
            id="preferences"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
              <FiClock className="text-blue-500" />
              Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Time Zone
                </label>
                <select
                  name="preferences.timezone"
                  value={formData.preferences.timezone}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        timezone: e.target.value
                      }
                    }));
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="Africa/Tunis">Tunisia (GMT+1)</option>
                  <option value="Africa/Algiers">Algeria (GMT+1)</option>
                  <option value="Africa/Casablanca">Morocco (GMT+1)</option>
                  <option value="Africa/Tripoli">Libya (GMT+2)</option>
                  <option value="Africa/Cairo">Egypt (GMT+2)</option>
                  <option value="Africa/Nouakchott">Mauritania (GMT+0)</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Languages
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['en', 'fr', 'ar'].map((lang) => (
                    <div key={lang} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`lang-${lang}`}
                        checked={formData.preferences.languages?.includes(lang)}
                        onChange={(e) => {
                          const currentLanguages = formData.preferences.languages || ['en'];
                          const newLanguages = e.target.checked
                            ? [...currentLanguages, lang]
                            : currentLanguages.filter(l => l !== lang);
                          setFormData(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              languages: newLanguages
                            }
                          }));
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`lang-${lang}`} className="ml-2 block text-sm text-gray-900">
                        {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            id="privacy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
              <FiLock className="text-blue-500" />
              Privacy & Security
            </h2>
            <div className="space-y-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Change Password
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.currentPassword}
                        onChange={(e) => {
                          setPasswords(prev => ({
                            ...prev,
                            currentPassword: e.target.value
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                        placeholder="••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={(e) => {
                          setPasswords(prev => ({
                            ...prev,
                            newPassword: e.target.value
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                        placeholder="Create a new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${passwords.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span>8+ characters</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${/[A-Z]/.test(passwords.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span>Uppercase</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${/[0-9]/.test(passwords.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span>Number</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${/[!@#$%^&*]/.test(passwords.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span>Special character</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={(e) => {
                          setPasswords(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }));
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 transition-all ${isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="text-lg" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {showVerificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl p-8 bg-white shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowVerificationModal(false);
                  setVerificationStep('phone');
                  setVerificationCode('');
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPhone className="text-blue-500 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Phone Verification</h3>
                <p className="text-gray-600 mb-4">
                  {verificationStep === 'phone'
                    ? 'We will send a verification code to your phone number.'
                    : `We sent a 6-digit code to ${formData.personalInfo.phone}`}
                </p>
              </div>

              {verificationStep === 'code' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Verification Code
                    </label>
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3, 4, 5].map(index => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          value={verificationCode[index] || ''}
                          onChange={(e) => {
                            const newCode = [...verificationCode];
                            newCode[index] = e.target.value;
                            setVerificationCode(newCode.join(''));
                          }}
                          className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      onClick={handlePhoneVerification}
                      disabled={countdown > 0}
                      className={`font-medium ${countdown > 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-500 hover:text-blue-600'
                        }`}
                    >
                      {countdown > 0
                        ? `Resend code in ${countdown}s`
                        : 'Resend code'}
                    </button>
                  </div>

                  <button
                    onClick={handleVerifyCode}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-medium shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiCheck size={20} />
                    Verify Code
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;