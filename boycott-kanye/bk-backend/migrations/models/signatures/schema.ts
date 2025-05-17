/**
 * Signatures collection schema definition for "Boycott Kanye" app
 */

export const signaturesCollectionDefinition = {
  name: 'signatures',
  type: 'base',
  fields: [
    {
      name: 'author_id',
      type: 'text',
      required: true,
      options: {},
    },
    {
      name: 'agree_checkbox',
      type: 'bool',
      required: true,
      options: {},
    },
    {
      name: 'public_display',
      type: 'bool',
      required: false,
      options: {},
    },
  ],
  // API access rules
  listRule: '', // Dostępne publicznie dla wszystkich
  viewRule: '', // Dostępne publicznie dla wszystkich
  createRule: '@request.auth.id != ""', // Tylko zalogowani użytkownicy mogą tworzyć
  updateRule: '@request.auth.id != ""', // Tylko zalogowani użytkownicy mogą aktualizować
  deleteRule: '@request.auth.id != ""', // Tylko zalogowani użytkownicy mogą usuwać
};
