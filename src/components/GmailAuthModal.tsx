import React from 'react';

/**
 * GmailAuthModal
 * Tính năng đăng nhập Gmail đã được gỡ bỏ theo yêu cầu của bạn.
 * Dữ liệu luyện chữ và điểm EXP được lưu trữ trực tiếp trên thiết bị (Local Storage).
 */
export const GmailAuthModal: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  profile?: any;
  onProfileUpdated?: (profile: any) => void;
}> = () => {
  return null;
};

export default GmailAuthModal;
