import { Modal } from './utils';
import { PortabellaConfig } from '@portabella/sdk';
import { useState } from 'react';

export function ConfigurationModal({
  onDismiss,
  onSubmit,
}: {
  onDismiss: () => void;
  onSubmit: (c: PortabellaConfig) => void;
}) {
  const [config, setConfig] = useState<PortabellaConfig>({
    token: '',
    projectId: '',
    teamId: '',
  });

  const updateConfig = (property: string, value: string) =>
    setConfig((c) => ({ ...c, [property]: value }));

  return (
    <Modal onDismiss={onDismiss}>
      <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            {/* <!-- Heroicon name: exclamation --> */}
            <img src="data:image/jpeg;base64,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" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              className="text-lg leading-6 font-medium text-gray-400"
              id="modal-headline"
            >
              Backup configuration
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                Setup PrivaNote configuration to write and read from Portabella.
                This integration is end-to-end encrypted and no one but you will
                ever be able to see your data. Read more about it{' '}
                <a
                  href="https://portabella.io/docs/tutorials/privanote"
                  className="underline hover:text-gray-500"
                  target="_blank"
                >
                  here
                </a>
                .
              </p>
            </div>
            <div className="mt-4">
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-400"
              >
                Token
              </label>
              <div className="mt-1">
                <input
                  id="token"
                  name="token"
                  required
                  className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={config.token}
                  onChange={(e) => updateConfig('token', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2">
              <label
                htmlFor="Project ID"
                className="block text-sm font-medium text-gray-400"
              >
                Project ID
              </label>
              <div className="mt-1">
                <input
                  id="project-id"
                  name="project-id"
                  required
                  className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={config.projectId}
                  onChange={(e) => updateConfig('projectId', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2 mb-2">
              <label
                htmlFor="Team ID"
                className="block text-sm font-medium text-gray-400"
              >
                Team ID (optional)
              </label>
              <div className="mt-1">
                <input
                  id="team-id"
                  name="team-id"
                  required
                  className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={config.teamId}
                  onChange={(e) => updateConfig('teamId', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={() => {
            onSubmit(config);
            onDismiss();
          }}
        >
          Activate
        </button>
        <button
          onClick={onDismiss}
          type="button"
          className="mt-3 w-full inline-flex justify-center shadow-sm px-4 py-2 text-base font-medium text-gray-300  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
