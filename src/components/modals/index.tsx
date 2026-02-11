/**
 * Auth Modals Index
 * Central export for all authentication modals
 */

import { RegisterModal } from './RegisterModal';
// import { ActivateModal } from './ActivateModal'; // Removed - security frozen, no email activation
import { LoginModal } from './LoginModal';
import { Verify2FAModal } from './Verify2FAModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { UpdateProfileModal } from './UpdateProfileModal';

export const AuthModals = () => {
  return (
    <>
      <RegisterModal />
      {/* <ActivateModal /> - Removed - security frozen */}
      <LoginModal />
      <Verify2FAModal />
      <ForgotPasswordModal />
      <ResetPasswordModal />
      <UpdateProfileModal />
    </>
  );
};

export { RegisterModal, LoginModal, Verify2FAModal, ForgotPasswordModal, ResetPasswordModal, UpdateProfileModal };
