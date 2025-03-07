import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import './UserModal.css';

function UserModal({ user, onClose, isDarkMode }) {
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className={`modal-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-overlay" />
        </Transition.Child>

        <div className="modal-content-wrapper">
          <div className="modal-content">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="modal-panel">
                <Dialog.Title as="h3">{user.first_name} {user.last_name}</Dialog.Title>
                <div className="modal-body">
                  {user.image_url && (
                    <img src={user.image_url} alt="User" className="user-image" />
                  )}
                  <p><strong>Passport ID:</strong> {user.passport_id}</p>
                  <p><strong>Telefon:</strong> {user.phone_number || 'N/A'}</p>
                  <p><strong>Manzil:</strong> {user.address || 'N/A'}</p>
                  <p><strong>Millati:</strong> {user.nationality || 'N/A'}</p>
                  <p><strong>Tug‘ilgan joyi:</strong> {user.birth_place || 'N/A'}</p>
                  <p><strong>Fuqaroligi:</strong> {user.citizenship || 'N/A'}</p>
                  <p><strong>Tug‘ilgan sana:</strong> {user.birth_date || 'N/A'}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={user.status === 'clean' ? 'status-clean' : 'status-wanted'}>
                      {user.status === 'clean' ? 'Toza' : 'Qidiruvda'}
                    </span>
                  </p>
                  {user.wanted_reason && (
                    <p><strong>Sabab:</strong> {user.wanted_reason}</p>
                  )}
                </div>
                <button onClick={onClose} className="modal-close-btn">
                  Yopish
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default UserModal;