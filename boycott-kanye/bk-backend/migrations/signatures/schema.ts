/**
 * Signatures collection schema definition for "Boycott Kanye" app
 */

export const signaturesCollection = {
  name: 'signatures',
  type: 'base',
  fields: [
    {
      name: 'user',
      type: 'relation',
      required: true,
      options: {
        collectionId: '_pb_users_auth_', // Wbudowana kolekcja użytkowników PocketBase
        cascadeDelete: true, // Usuń podpisy gdy użytkownik jest usunięty
        maxSelect: 1, // Jeden użytkownik na podpis
      },
    },
    {
      name: 'agree_checkbox',
      type: 'bool',
      required: true,
    },
    {
      name: 'public_display',
      type: 'bool',
      required: true,
    },
    {
      name: 'created_at',
      type: 'date',
      required: false,
      options: {
        autoCreate: true, // Automatycznie ustaw datę utworzenia
      },
    },
  ],
  // API access rules
  listRule: '', // Dostępne publicznie dla wszystkich
  viewRule: '', // Dostępne publicznie dla wszystkich
  createRule: '@request.auth.id != ""', // Tylko zalogowani użytkownicy mogą tworzyć
  updateRule: '@request.auth.id != ""', // Tylko zalogowani użytkownicy mogą aktualizować
  deleteRule: '@request.auth.id != ""', // Tylko zalogowani użytkownicy mogą usuwać
};
