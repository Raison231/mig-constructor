import type { ModuleInstance } from '@/stores/configurator'

export type TemplateId =
	| 'studio'
	| 'family'
	| 'office'
	| 'workshop'
	| 'glamping'
	| 'hub'

export type TemplatePreset = {
	id: TemplateId
	nameRu: string
	nameEn: string
	nameKa: string
	descRu: string
	descEn: string
	descKa: string
	icon: string
	areaM2: number
	layout: ModuleInstance[]
}

// Хелпер: расставляем модули в линию вдоль X со смещением Z для крыла
const inst = (
	moduleId: string,
	material: 'container' | 'timber' | 'hybrid',
	position: [number, number, number],
	rotationY = 0,
	instanceId?: string
): ModuleInstance => ({
	instanceId: instanceId ?? `preset-${moduleId}-${position.join('-')}`,
	moduleId,
	material,
	position,
	rotationY,
})

export const TEMPLATE_PRESETS: TemplatePreset[] = [
	{
		id: 'studio',
		nameRu: 'Студия',
		nameEn: 'Studio',
		nameKa: 'სტუდია',
		descRu: 'Минимализм: ядро + санузел + терраса',
		descEn: 'Minimal: core + bath + deck',
		descKa: 'მინიმალისტური: ბირთვი + სველი + ტერასა',
		icon: '🏕️',
		areaM2: 28,
		layout: [
			inst('core', 'timber', [0, 0, 0]),
			inst('bathroom', 'timber', [3.5, 0, 0]),
			inst('deck', 'timber', [-3.5, 0, 0]),
		],
	},
	{
		id: 'family',
		nameRu: 'Семейный',
		nameEn: 'Family',
		nameKa: 'საოჯახო',
		descRu: 'Двухкрылый: 2 спальни + кухня + гостиная + санузел',
		descEn: 'Two wings: 2 bedrooms + kitchen + living + bath',
		descKa: 'ორი ფრთა: 2 საძინებელი + სამზარეულო + სასტუმრო + სველი',
		icon: '🏡',
		areaM2: 72,
		layout: [
			inst('core', 'hybrid', [0, 0, 0]),
			inst('kitchen', 'hybrid', [3.5, 0, 0]),
			inst('bedroom', 'hybrid', [-3.5, 0, 0]),
			inst('bedroom', 'hybrid', [-7, 0, 0], 0, 'preset-bedroom-2'),
			inst('bathroom', 'hybrid', [0, 0, 3.5]),
			inst('deck', 'timber', [3.5, 0, 3.5]),
		],
	},
	{
		id: 'office',
		nameRu: 'Офис',
		nameEn: 'Office',
		nameKa: 'ოფისი',
		descRu: 'Рабочее пространство: опен-спейс + переговорка + кухня',
		descEn: 'Workspace: open-space + meeting + kitchen',
		descKa: 'სამუშაო სივრცე: ღია სივრცე + შეხვედრები + სამზარეულო',
		icon: '💼',
		areaM2: 64,
		layout: [
			inst('hub-core', 'container', [0, 0, 0]),
			inst('office', 'container', [3.5, 0, 0]),
			inst('office', 'container', [-3.5, 0, 0], 0, 'preset-office-2'),
			inst('kitchen', 'hybrid', [0, 0, 3.5]),
			inst('solar-tower', 'hybrid', [7, 0, 0]),
		],
	},
	{
		id: 'workshop',
		nameRu: 'Мастерская',
		nameEn: 'Workshop',
		nameKa: 'სახელოსნო',
		descRu: 'Производственная: цех + офис + склад + солнечная башня',
		descEn: 'Production: workshop + office + storage + solar tower',
		descKa: 'საწარმოო: სახელოსნო + ოფისი + საწყობი + მზის კოშკი',
		icon: '🔧',
		areaM2: 96,
		layout: [
			inst('workshop', 'container', [0, 0, 0]),
			inst('office', 'container', [3.5, 0, 0]),
			inst('storage', 'container', [-3.5, 0, 0]),
			inst('solar-tower', 'hybrid', [0, 0, 3.5]),
			inst('water-tank', 'container', [3.5, 0, 3.5]),
		],
	},
	{
		id: 'glamping',
		nameRu: 'Глэмпинг',
		nameEn: 'Glamping',
		nameKa: 'გლემპინგი',
		descRu: '3 капсулы + сауна + общая зона + терраса с видом',
		descEn: '3 capsules + sauna + common + view deck',
		descKa: '3 კაფსულა + საუნა + საერთო + ხედი',
		icon: '🏞️',
		areaM2: 84,
		layout: [
			inst('capsule', 'timber', [0, 0, 0]),
			inst('capsule', 'timber', [3.5, 0, 0], 0, 'preset-capsule-2'),
			inst('capsule', 'timber', [-3.5, 0, 0], 0, 'preset-capsule-3'),
			inst('sauna', 'timber', [0, 0, 3.5]),
			inst('core', 'timber', [3.5, 0, 3.5]),
			inst('deck', 'timber', [-3.5, 0, 3.5]),
			inst('well-cap', 'timber', [7, 0, 0]),
		],
	},
	{
		id: 'hub',
		nameRu: 'Хаб',
		nameEn: 'Hub',
		nameKa: 'ჰაბი',
		descRu: 'Коммуна: общий хаб + 4 жилых крыла + солнечная + вода',
		descEn: 'Commune: hub + 4 living wings + solar + water',
		descKa: 'კომუნა: ჰაბი + 4 საცხოვრებელი + მზე + წყალი',
		icon: '🏛️',
		areaM2: 168,
		layout: [
			inst('hub-core', 'hybrid', [0, 0, 0]),
			inst('bedroom', 'hybrid', [3.5, 0, 0]),
			inst('bedroom', 'hybrid', [-3.5, 0, 0], 0, 'preset-hub-bed-2'),
			inst('bedroom', 'hybrid', [0, 0, 3.5], 0, 'preset-hub-bed-3'),
			inst('bedroom', 'hybrid', [0, 0, -3.5], 0, 'preset-hub-bed-4'),
			inst('kitchen', 'hybrid', [3.5, 0, 3.5]),
			inst('bathroom', 'hybrid', [-3.5, 0, 3.5]),
			inst('sauna', 'timber', [-3.5, 0, -3.5]),
			inst('solar-tower', 'hybrid', [7, 0, 0]),
			inst('water-tank', 'container', [-7, 0, 0]),
			inst('glass-bridge', 'hybrid', [3.5, 0, -3.5]),
			inst('carport', 'container', [7, 0, 3.5]),
		],
	},
]
