import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show install button after a delay if not already shown
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isInstalled) {
        setShowInstallButton(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual installation instructions
      const userAgent = navigator.userAgent.toLowerCase();
      let instructions = '';
      
      if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        instructions = 'Để cài đặt ứng dụng trên iPhone/iPad:\n\n' +
          '1. Nhấn vào nút Chia sẻ (hình vuông với mũi tên)\n' +
          '2. Cuộn xuống và chọn "Thêm vào Màn hình chính"\n' +
          '3. Nhấn "Thêm" ở góc trên bên phải';
      } else if (userAgent.includes('android')) {
        instructions = 'Để cài đặt ứng dụng trên Android:\n\n' +
          '1. Nhấn vào menu 3 chấm (⋮) ở góc trên bên phải\n' +
          '2. Chọn "Thêm vào màn hình chính" hoặc "Cài đặt ứng dụng"\n' +
          '3. Nhấn "Thêm" hoặc "Cài đặt"';
      } else {
        instructions = 'Để cài đặt ứng dụng:\n\n' +
          'iOS: Nhấn nút Chia sẻ và chọn "Thêm vào Màn hình chính"\n' +
          'Android: Nhấn menu 3 chấm và chọn "Thêm vào màn hình chính"\n' +
          'Desktop: Nhấn biểu tượng cài đặt ở thanh địa chỉ';
      }
      
      Alert.alert('Cài đặt ứng dụng', instructions, [{ text: 'OK' }]);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  if (isInstalled || !showInstallButton) {
    return null;
  }

  return (
    <View style={styles.installButton}>
      <TouchableOpacity style={styles.button} onPress={handleInstallClick}>
        <Text style={styles.buttonText}>📱 Cài đặt ứng dụng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  installButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
