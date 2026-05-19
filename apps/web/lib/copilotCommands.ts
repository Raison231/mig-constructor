import type { Material } from '@mig/modules-schema'
import type { Weather, Site, CameraMode } from '@/stores/world'

export type CopilotAction =
  | { type: 'add_module'; moduleId: string; material: Material }
  | { type: 'set_hour'; hour: number }
  | { type: 'set_weather'; weather: Weather }
  | { type: 'set_site'; site: Site }
  | { type: 'set_camera'; mode: CameraMode }
  | { type: 'reset' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'load_preset'; presetId: string }
  | { type: 'rotate' }
  | { type: 'duplicate' }
  | { type: 'remove' }
  | { type: 'help' }
  | { type: 'unknown'; text: string }

const MODULE_KEYWORDS: Array<[string, string]> = [
  ['кухн', 'kitchen-pod'], ['kitchen', 'kitchen-pod'],
  ['спальн', 'bedroom-pano'], ['bedroom', 'bedroom-pano'],
  ['санузел', 'bathroom-spa'], ['ванн', 'bathroom-spa'], ['bathroom', 'bathroom-spa'],
  ['офис', 'office-studio'], ['office', 'office-studio'],
  ['сауна', 'sauna-wellness'], ['sauna', 'sauna-wellness'],
  ['бассейн', 'pool-hottub'], ['джакузи', 'pool-hottub'], ['pool', 'pool-hottub'],
  ['теплиц', 'greenhouse'], ['greenhouse', 'greenhouse'],
  ['мастерск', 'workshop'], ['workshop', 'workshop'],
  ['руф', 'rooftop'], ['rooftop', 'rooftop'],
  ['погреб', 'cellar'], ['cellar', 'cellar'],
  ['детск', 'kids-lab'], ['kids', 'kids-lab'],
  ['звук', 'sound-studio'], ['sound', 'sound-studio'],
  ['душ', 'outdoor-shower'], ['shower', 'outdoor-shower'],
  ['афрейм', 'aframe-loft'], ['a-frame', 'aframe-loft'], ['aframe', 'aframe-loft'],
  ['купол', 'geo-dome'], ['dome', 'geo-dome'],
  ['гараж', 'garage'], ['garage', 'garage'],
  ['навес', 'carport'], ['carport', 'carport'],
  ['террас', 'terrace-roof'], ['terrace', 'terrace-roof'],
  ['мост', 'glass-bridge'], ['bridge', 'glass-bridge'],
  ['обзорн', 'observation-deck'], ['палуб', 'observation-deck'], ['deck', 'observation-deck'],
  ['колодец', 'well-cap'], ['well', 'well-cap'],
  ['солнечн', 'solar-tower'], ['solar', 'solar-tower'],
  ['бак', 'water-tank'], ['резервуар', 'water-tank'], ['tank', 'water-tank'],
  ['ядро', 'hub-core'], ['хаб', 'hub-core'], ['hub', 'hub-core'],
]

const MATERIAL_KEYWORDS: Array<[string, Material]> = [
  ['дерев', 'timber'], ['timber', 'timber'],
  ['контейнер', 'container'], ['container', 'container'],
  ['гибрид', 'hybrid'], ['hybrid', 'hybrid'],
]

const SITE_KEYWORDS: Array<[string, Site]> = [
  ['тбилиси', 'tbilisi'], ['tbilisi', 'tbilisi'],
  ['бакуриани', 'bakuriani'], ['bakuriani', 'bakuriani'],
  ['кахети', 'kakheti'], ['kakheti', 'kakheti'],
  ['аджари', 'adjara'], ['adjara', 'adjara'],
]

const WEATHER_KEYWORDS: Array<[string, Weather]> = [
  ['ясно', 'clear'], ['солнц', 'clear'], ['clear', 'clear'], ['sunny', 'clear'],
  ['дожд', 'rain'], ['rain', 'rain'],
  ['снег', 'snow'], ['snow', 'snow'],
  ['туман', 'fog'], ['fog', 'fog'],
]

const CAMERA_KEYWORDS: Array<[string, CameraMode]> = [
  ['орбит', 'orbit'], ['orbit', 'orbit'],
  ['сверху', 'topdown'], ['top-down', 'topdown'], ['topdown', 'topdown'], ['план', 'topdown'],
  ['кино', 'cinematic'], ['cinematic', 'cinematic'], ['кинемат', 'cinematic'],
  ['интерьер', 'interior'], ['interior', 'interior'],
]

const PRESET_KEYWORDS: Array<[string, string]> = [
  ['минидач', 'minidacha'], ['дача', 'minidacha'],
  ['глэмпинг', 'glamping'], ['glamping', 'glamping'],
  ['студи', 'studio'],
  ['эко', 'eco-estate'], ['усадьб', 'eco-estate'],
  ['муз', 'music-studio'], ['weeekend', 'music-studio'], ['music', 'music-studio'],
  ['курорт', 'resort'], ['resort', 'resort'],
]

function findFirst<T>(text: string, table: Array<[string, T]>): T | null {
  for (const [key, value] of table) {
    if (text.includes(key)) return value
  }
  return null
}

function findMaterial(text: string): Material {
  return findFirst(text, MATERIAL_KEYWORDS) ?? 'timber'
}

function parseHour(text: string): number | null {
  if (/(полноч|midnight)/.test(text)) return 0
  if (/(ноч|night)/.test(text)) return 23
  if (/(закат|sunset|вечер)/.test(text)) return 19
  if (/(восход|sunrise|рассвет|утр)/.test(text)) return 7
  if (/(полдень|noon|день|day)/.test(text)) return 13
  const m = /(\d{1,2})\s*(?:час|ч\b|h\b)/.exec(text)
  if (m) {
    const h = parseInt(m[1], 10)
    if (h >= 0 && h <= 23) return h
  }
  return null
}

export function parseCopilotInput(raw: string): CopilotAction {
  const text = raw.toLowerCase().trim()
  if (!text) return { type: 'unknown', text: raw }

  if (/(^|\s)(\?|help|помощь|подскажи|команд)/.test(text)) return { type: 'help' }
  if (/(очист|сброс|reset|clear|удали всё|удали все)/.test(text)) return { type: 'reset' }
  if (/(откат|отмена|undo)/.test(text)) return { type: 'undo' }
  if (/(повтор|redo)/.test(text)) return { type: 'redo' }
  if (/(поверн|rotate)/.test(text)) return { type: 'rotate' }
  if (/(дублир|копир|duplicate|клон)/.test(text)) return { type: 'duplicate' }
  if (/(снеси|delete\b|remove\b)/.test(text)) return { type: 'remove' }

  const presetKey = findFirst(text, PRESET_KEYWORDS)
  if (presetKey && /(пресет|preset|шаблон|загрузи|сцен)/.test(text)) {
    return { type: 'load_preset', presetId: presetKey }
  }

  const hour = parseHour(text)
  if (hour !== null) return { type: 'set_hour', hour }

  const weather = findFirst(text, WEATHER_KEYWORDS)
  if (weather) return { type: 'set_weather', weather }

  const site = findFirst(text, SITE_KEYWORDS)
  if (site) return { type: 'set_site', site }

  const camera = findFirst(text, CAMERA_KEYWORDS)
  if (camera) return { type: 'set_camera', mode: camera }

  const moduleId = findFirst(text, MODULE_KEYWORDS)
  if (moduleId) {
    const material = findMaterial(text)
    return { type: 'add_module', moduleId, material }
  }

  return { type: 'unknown', text: raw }
}

export const COPILOT_HELP_RU = [
  '✨ Я MIG Copilot. Понимаю:',
  '• «поставь кухню» — добавит модуль (кухня, спальня, санузел, офис, сауна, бассейн, теплица, мастерская, погреб, душ, гараж, навес, ядро, купол, мост, бак, колодец, солнце, обзорная…)',
  '• «деревянный / контейнер / гибрид» — материал',
  '• «ночь / день / 19 часов / закат / восход» — час суток',
  '• «снег / дождь / туман / ясно» — погода',
  '• «Бакуриани / Тбилиси / Кахетия / Аджария» — сайт',
  '• «вид сверху / кино / орбита / интерьер» — камера',
  '• «пресет глэмпинг / эко / курорт / минидача / студия / музстудия» — готовая сцена',
  '• «удали / дублируй / поверни» — действия с выбранным',
  '• «откат / повтор / очисти» — undo / redo / clear',
].join('\n')
