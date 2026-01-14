-- ============================================
-- 种子数据：Alpine Explorer 示例数据
-- ============================================

-- 注意：此脚本需要使用 service role key 执行
-- 因为 equipment 表的 RLS 策略禁止普通用户插入

-- ============================================
-- 装备示例数据
-- ============================================

INSERT INTO equipment (name, brand, price, category, image_url, description, gallery) VALUES
-- 五金类
(
  '专业冰镐',
  'Black Diamond',
  1299.00,
  '五金',
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
  '轻量化设计，适合技术攀登和冰壁攀爬。采用航空铝材质，配备可更换镐尖。',
  ARRAY['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800']
),
(
  '登山绳 60m',
  'Petzl',
  899.00,
  '五金',
  'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400',
  '9.8mm 动力绳，UIAA 认证，适合多段攀登和先锋攀登。',
  ARRAY['https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800']
),
(
  '快挂组 12件套',
  'DMM',
  688.00,
  '五金',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
  '轻量化快挂，热锻造铝合金门，适合运动攀和传统攀。',
  NULL
),

-- 服装类
(
  'Gore-Tex 冲锋衣',
  'Arc''teryx',
  4599.00,
  '服装',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
  '三层 Gore-Tex Pro 面料，防水透气，适合极端天气条件下的高海拔攀登。',
  ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800']
),
(
  '羽绒服 800蓬',
  'Mountain Hardwear',
  2899.00,
  '服装',
  'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
  '800蓬松度鹅绒填充，轻量保暖，可压缩收纳。',
  NULL
),
(
  '软壳裤',
  'Patagonia',
  1299.00,
  '服装',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  '四向弹力面料，防风防泼水，适合技术攀登和徒步。',
  NULL
),

-- 安全类
(
  '攀岩头盔',
  'Petzl',
  699.00,
  '安全',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
  '轻量化设计，EPS 泡沫内衬，通过 CE 和 UIAA 认证。',
  ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800']
),
(
  '安全带',
  'Black Diamond',
  599.00,
  '安全',
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400',
  '四扣设计，可调节腿环，适合全年使用。配备装备环和冰螺旋挂点。',
  NULL
),
(
  '下降器/保护器',
  'Petzl',
  459.00,
  '安全',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  '辅助制动下降器，适合单绳和双绳操作，带防恐慌功能。',
  NULL
),

-- 背包类
(
  '攀登背包 45L',
  'Osprey',
  1599.00,
  '背包',
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400',
  '技术攀登专用设计，可拆卸顶包，冰镐挂点，防水面料。',
  ARRAY['https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800']
),
(
  '日用攀岩包 22L',
  'Patagonia',
  899.00,
  '背包',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=400',
  '简约设计，适合单日攀岩和徒步，配备绳索固定带。',
  NULL
),
(
  '登顶包 30L',
  'The North Face',
  699.00,
  '背包',
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400',
  '超轻设计，可折叠收纳，适合登顶冲刺使用。',
  NULL
);

-- ============================================
-- 完成提示
-- ============================================
-- 种子数据插入完成
-- 共插入 12 件装备商品
