import { StrictMode, useState } from 'react';
import { createStore } from 'tinybase';
import { createPglitePersister } from 'tinybase/persisters/persister-pglite';
import {
  Provider,
  useCreatePersister,
  useCreateStore,
} from 'tinybase/ui-react';
import {
  SortedTableInHtmlTable,
  ValuesInHtmlTable,
} from 'tinybase/ui-react-dom';
import { Inspector } from 'tinybase/ui-react-inspector';
import { PGlite } from '@electric-sql/pglite';
import { Buttons } from './Buttons';

export const App = () => {
  const [initializing, setInitializing] = useState(true);

  const store = useCreateStore(() => {
    // Create the TinyBase Store and initialize the Store's data
    return createStore()
      .setValue('counter', 0)
      .setRow('pets', '0', { name: 'fido', species: 'dog' });
  });

  useCreatePersister(store, async (store) => {
    const pglite = await PGlite.create('idb://tinybase');
    const persister = await createPglitePersister(store, pglite);
    await persister.startAutoLoad();
    await persister.startAutoSave();
    setInitializing(false);
    return persister;
  });

  return (
    <StrictMode>
      {initializing ? (
        'Initializing...'
      ) : (
        <Provider store={store}>
          <header>
            <h1>
              <img src='/favicon.svg' />
              TinyBase & PGlite
            </h1>
            Changes are saved to PGlite in the browser. Refresh the page to see
            them restored.
          </header>
          <Buttons />
          <div>
            <h2>Values</h2>
            <ValuesInHtmlTable />
          </div>
          <div>
            <h2>Pets Table</h2>
            <SortedTableInHtmlTable
              tableId='pets'
              cellId='name'
              limit={5}
              sortOnClick={true}
              className='sortedTable'
              paginator={true}
            />
          </div>
          <Inspector />
        </Provider>
      )}
    </StrictMode>
  );
};
