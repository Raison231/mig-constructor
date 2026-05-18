export type Locale = 'ru' | 'en' | 'ka'

const ru: Record<string, string> = {
  'app.subtitle': 'v0.6 · Wave 6',
  'panel.modules': 'Модули', 'panel.price': 'Стоимость', 'panel.timeline': 'Тайминг', 'panel.shortcuts': 'Горячие клавиши',
  'mat.container': 'Контейнер', 'mat.timber': 'Дерево', 'mat.hybrid': 'Гибрид', 'mat.any': 'Любой',
  'price.modules': 'Модули', 'price.delivery': 'Доставка', 'price.earthworks': 'Земляные работы', 'price.assembly': 'Сборка', 'price.total': 'Итого',
  'timeline.survey': 'Изыскания + разрешения', 'timeline.earthworks': 'Котлован + фундамент', 'timeline.factory': 'Производство', 'timeline.delivery': 'Доставка + сборка', 'timeline.total': 'недель всего',
  'sel.rotate': 'Поворот', 'sel.duplicate': 'Дубль', 'sel.delete': 'Удалить', 'sel.deselect': 'Снять выбор',
  'shortcut.select': 'Выбрать модуль', 'shortcut.move': 'Перетащить', 'shortcut.rot': 'Поворот ±90°', 'shortcut.dup': 'Дубль', 'shortcut.del': 'Удалить', 'shortcut.undo': 'Отмена', 'shortcut.redo': 'Повтор',
  'header.share': 'Поделиться', 'header.screenshot': 'Скриншот', 'header.reset': 'Сброс',
  'loading.scene': 'Загружаем сцену…', 'share.copied': 'Ссылка скопирована', 'share.failed': 'Не удалось скопировать',
  'world.title': 'Мир', 'world.sun': 'Солнце', 'world.weather': 'Погода', 'world.site': 'Локация', 'world.camera': 'Камера',
  'weather.clear': 'Ясно', 'weather.rain': 'Дождь', 'weather.snow': 'Снег', 'weather.fog': 'Туман',
  'site.tbilisi': 'Тбилиси', 'site.bakuriani': 'Бакуриани', 'site.kakheti': 'Кахетия', 'site.adjara': 'Аджария',
  'camera.orbit': 'Орбита', 'camera.topdown': 'Сверху', 'camera.cinematic': 'Кино', 'camera.interior': 'Внутри',
  'camera.interiorHint': 'Клик по сцене → обзор мышью · WASD — ходьба · Shift — бег',
  'pro.title': 'PRO', 'pro.tab.energy': 'Энергия', 'pro.tab.cost': 'Стоимость', 'pro.tab.tools': 'Инструменты',
  'pro.bom': 'BOM PDF', 'pro.measure': 'Измерения', 'pro.measureOn': 'Измерения ВКЛ',
  'pro.measureHint': 'Клик 1 → старт · Клик 2 → измерить · Клик 3 → сброс',
  'pro.measureClear': 'Очистить точки',
  'energy.rating': 'Рейтинг', 'energy.autonomy': 'Автономность',
  'energy.kwh': 'Потребление', 'energy.solar': 'Солнечная', 'energy.water': 'Вода', 'energy.co2': 'CO₂ след',
  'energy.noWater': '⚠ Нет источника воды — добавь Well Cap или Water Tank',
  'energy.lowAutonomy': '⚠ Низкая автономность — добавь Solar Tower или Carport',
  'cost.material': 'Премиум материалов', 'cost.location': 'Сложность участка', 'cost.rush': 'Срочность',
  'cost.reset': 'Сбросить множители',
}

const en: Record<string, string> = {
  'app.subtitle': 'v0.6 · Wave 6',
  'panel.modules': 'Modules', 'panel.price': 'Price', 'panel.timeline': 'Timeline', 'panel.shortcuts': 'Shortcuts',
  'mat.container': 'Container', 'mat.timber': 'Timber', 'mat.hybrid': 'Hybrid', 'mat.any': 'Any',
  'price.modules': 'Modules', 'price.delivery': 'Delivery', 'price.earthworks': 'Earthworks', 'price.assembly': 'Assembly', 'price.total': 'Total',
  'timeline.survey': 'Survey + permits', 'timeline.earthworks': 'Earthworks + foundation', 'timeline.factory': 'Factory production', 'timeline.delivery': 'Delivery + assembly', 'timeline.total': 'weeks total',
  'sel.rotate': 'Rotate', 'sel.duplicate': 'Duplicate', 'sel.delete': 'Delete', 'sel.deselect': 'Deselect',
  'shortcut.select': 'Select module', 'shortcut.move': 'Move module', 'shortcut.rot': 'Rotate ±90°', 'shortcut.dup': 'Duplicate', 'shortcut.del': 'Remove', 'shortcut.undo': 'Undo', 'shortcut.redo': 'Redo',
  'header.share': 'Share', 'header.screenshot': 'Screenshot', 'header.reset': 'Reset',
  'loading.scene': 'Loading scene…', 'share.copied': 'Link copied', 'share.failed': 'Copy failed',
  'world.title': 'World', 'world.sun': 'Sun', 'world.weather': 'Weather', 'world.site': 'Site', 'world.camera': 'Camera',
  'weather.clear': 'Clear', 'weather.rain': 'Rain', 'weather.snow': 'Snow', 'weather.fog': 'Fog',
  'site.tbilisi': 'Tbilisi', 'site.bakuriani': 'Bakuriani', 'site.kakheti': 'Kakheti', 'site.adjara': 'Adjara',
  'camera.orbit': 'Orbit', 'camera.topdown': 'Top', 'camera.cinematic': 'Cine', 'camera.interior': 'Inside',
  'camera.interiorHint': 'Click scene → mouse look · WASD — walk · Shift — run',
  'pro.title': 'PRO', 'pro.tab.energy': 'Energy', 'pro.tab.cost': 'Cost', 'pro.tab.tools': 'Tools',
  'pro.bom': 'BOM PDF', 'pro.measure': 'Measure', 'pro.measureOn': 'Measure ON',
  'pro.measureHint': 'Click 1 → start · Click 2 → measure · Click 3 → reset',
  'pro.measureClear': 'Clear points',
  'energy.rating': 'Rating', 'energy.autonomy': 'Autonomy',
  'energy.kwh': 'Consumption', 'energy.solar': 'Solar gen', 'energy.water': 'Water', 'energy.co2': 'CO₂ embodied',
  'energy.noWater': '⚠ No water source — add Well Cap or Water Tank',
  'energy.lowAutonomy': '⚠ Low autonomy — add Solar Tower or Carport',
  'cost.material': 'Material premium', 'cost.location': 'Site difficulty', 'cost.rush': 'Rush factor',
  'cost.reset': 'Reset multipliers',
}

const ka: Record<string, string> = {
  'app.subtitle': 'v0.6 · Wave 6',
  'panel.modules': 'მოდულები', 'panel.price': 'ფასი', 'panel.timeline': 'ვადები', 'panel.shortcuts': 'მალსახმობები',
  'mat.container': 'კონტეინერი', 'mat.timber': 'ხე', 'mat.hybrid': 'ჰიბრიდი', 'mat.any': 'ნებისმიერი',
  'price.modules': 'მოდულები', 'price.delivery': 'მიწოდება', 'price.earthworks': 'მიწის სამუშაოები', 'price.assembly': 'მონტაჟი', 'price.total': 'სულ',
  'timeline.survey': 'კვლევა + ნებართვები', 'timeline.earthworks': 'მიწის სამ. + ფუნდამენტი', 'timeline.factory': 'ქარხანა', 'timeline.delivery': 'მიწოდება + მონტაჟი', 'timeline.total': 'კვირა სულ',
  'sel.rotate': 'მობრუნება', 'sel.duplicate': 'დუბლი', 'sel.delete': 'წაშლა', 'sel.deselect': 'არჩევის მოხსნა',
  'shortcut.select': 'მოდულის არჩევა', 'shortcut.move': 'გადატანა', 'shortcut.rot': 'მობრუნება ±90°', 'shortcut.dup': 'დუბლი', 'shortcut.del': 'წაშლა', 'shortcut.undo': 'უკან', 'shortcut.redo': 'წინ',
  'header.share': 'გაზიარება', 'header.screenshot': 'სკრინშოტი', 'header.reset': 'გასუფთავება',
  'loading.scene': 'სცენის ჩატვირთვა…', 'share.copied': 'ბმული დაკოპირდა', 'share.failed': 'კოპირება ვერ მოხერხდა',
  'world.title': 'მსოფლიო', 'world.sun': 'მზე', 'world.weather': 'ამინდი', 'world.site': 'ლოკაცია', 'world.camera': 'კამერა',
  'weather.clear': 'მზიანი', 'weather.rain': 'წვიმა', 'weather.snow': 'თოვლი', 'weather.fog': 'ნისლი',
  'site.tbilisi': 'თბილისი', 'site.bakuriani': 'ბაკურიანი', 'site.kakheti': 'კახეთი', 'site.adjara': 'აჭარა',
  'camera.orbit': 'ორბიტა', 'camera.topdown': 'ზედან', 'camera.cinematic': 'კინო', 'camera.interior': 'შიგნით',
  'camera.interiorHint': 'დააჭირეთ სცენას · WASD — სიარული · Shift — სწრაფი',
  'pro.title': 'PRO', 'pro.tab.energy': 'ენერგია', 'pro.tab.cost': 'ფასი', 'pro.tab.tools': 'ხელსაწყოები',
  'pro.bom': 'BOM PDF', 'pro.measure': 'გაზომვა', 'pro.measureOn': 'გაზომვა ON',
  'pro.measureHint': 'კლიკი 1 → დაწყება · კლიკი 2 → გაზომვა',
  'pro.measureClear': 'წერტილების გასუფთავება',
  'energy.rating': 'რეიტინგი', 'energy.autonomy': 'ავტონომია',
  'energy.kwh': 'მოხმარება', 'energy.solar': 'მზის', 'energy.water': 'წყალი', 'energy.co2': 'CO₂ კვალი',
  'energy.noWater': '⚠ წყლის წყარო არ არის',
  'energy.lowAutonomy': '⚠ დაბალი ავტონომია',
  'cost.material': 'მასალის პრემიუმი', 'cost.location': 'ადგილის სირთულე', 'cost.rush': 'სისწრაფე',
  'cost.reset': 'მულტიპლიკატორების გასუფთავება',
}

const dict: Record<Locale, Record<string, string>> = { ru, en, ka }

export function t(key: string, locale: Locale): string {
  return dict[locale]?.[key] ?? en[key] ?? key
}

export function pickName(
  name: { ru: string; en: string; ka: string },
  locale: Locale,
): string {
  return name[locale] ?? name.en
}
