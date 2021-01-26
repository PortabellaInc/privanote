import { Modal } from './utils';

export function WelcomeModal({
  onDismiss,
  onSubmit,
}: {
  onDismiss: () => void;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <Modal onDismiss={onDismiss}>
      <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-6">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg
              className="h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
              />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              className="text-lg leading-6 font-medium text-gray-300"
              id="modal-headline"
            >
              Enable encrypted backup?
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-400">
                PrivaNote leverages{' '}
                <a
                  href="https://portabella.io"
                  target="_blank"
                  className="text-brand-700"
                >
                  Portabella
                </a>{' '}
                to store your encrypted notes data. You can read more about this
                integration{' '}
                <a
                  className="underline"
                  target="_blank"
                  href="https://portabella.io/docs"
                >
                  here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={() => {
            onSubmit();
          }}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-800 text-base font-medium text-white hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Yes please!
        </button>
        <button
          onClick={onDismiss}
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Do later
        </button>
      </div>
    </Modal>
  );
}
