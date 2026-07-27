import { Alert, Platform } from 'react-native';

type AlertButton = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

// react-native-web's Alert.alert is a no-op stub, so popups never appear when
// testing via `expo start --web`. Fall back to window.alert/window.confirm there.
export function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export function showConfirm(title: string, message: string, buttons: AlertButton[]) {
  if (Platform.OS === 'web') {
    if (window.confirm(message ? `${title}\n\n${message}` : title)) {
      buttons.find(b => b.style !== 'cancel')?.onPress?.();
    }
    return;
  }
  Alert.alert(title, message, buttons);
}
