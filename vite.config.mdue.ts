/* central list of mdue icons available appWide/global 
  a handRolled viteAutoImport resolver
  ( checks componentName against globalIcons(list/array) )
*/
const globalIcons = [
  'Vuejs',
  'Tailwind',
  'EyeOff',
  'Steam',
  'HeartOutline'
]

export const MyMdueIconResolver = componentName => {
  const isGlobalIcon = globalIcons.includes(componentName)
  if (isGlobalIcon) { return { name: componentName, from: 'mdue' } }
}
