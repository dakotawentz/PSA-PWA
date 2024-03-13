import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {

  // Open the database
  const db = await openDB('jate', 1);

  // Create a transaction and get the object store
  const tx = db.transaction('jate', 'readwrite');

  // Add the content to the object store
  const store = tx.objectStore('jate');
  await store.add(content);
  
  // Wait for the transaction to complete
  await tx.done;
  console.log('Content added to the database:', content);
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {

  // Open the database
  const db = await openDB('jate', 1);

  // Create a transaction and get the object store
  const tx = db.transaction('jate', 'readonly');

  // Get all the content from the object store
  const store = tx.objectStore('jate');
  const allContent = await store.getAll();

  // Wait for the transaction to complete
  await tx.done;
  console.log('All content retrieved from the database:', allContent);
  return allContent;
};

initdb();
