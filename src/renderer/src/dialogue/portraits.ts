const portraitModules = import.meta.glob<string>(
  '../../../../resources/portraits/**/*.png',
  { eager: true, import: 'default' }
)

export function getPortraitUrl(speciesName: string, emotion: string): string | null {
  const key = `../../../../resources/portraits/${speciesName}/${emotion}.png`
  return portraitModules[key] ?? null
}
