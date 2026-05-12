
-- =========================================================
-- COUNTRIES
-- =========================================================
CREATE TABLE public.countries (
  code text PRIMARY KEY,
  name text NOT NULL,
  flag_emoji text,
  flag_url text,
  show_on_homepage boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 1000,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read countries" ON public.countries
  FOR SELECT USING (true);

CREATE POLICY "manage write countries" ON public.countries
  FOR ALL TO authenticated
  USING (can_manage(auth.uid()))
  WITH CHECK (can_manage(auth.uid()));

CREATE TRIGGER countries_touch
BEFORE UPDATE ON public.countries
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- INDICATOR DEFINITIONS
-- =========================================================
CREATE TABLE public.indicator_definitions (
  key text PRIMARY KEY,
  label text NOT NULL,
  unit text,
  higher_is_better boolean,
  display_order int NOT NULL DEFAULT 1000,
  show_on_homepage boolean NOT NULL DEFAULT false,
  show_on_dashboard boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.indicator_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read indicator defs" ON public.indicator_definitions
  FOR SELECT USING (true);

CREATE POLICY "manage write indicator defs" ON public.indicator_definitions
  FOR ALL TO authenticated
  USING (can_manage(auth.uid()))
  WITH CHECK (can_manage(auth.uid()));

CREATE TRIGGER indicator_definitions_touch
BEFORE UPDATE ON public.indicator_definitions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- COUNTRY INDICATORS  (one row per country × indicator)
-- =========================================================
CREATE TABLE public.country_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL REFERENCES public.countries(code) ON DELETE CASCADE,
  indicator_key text NOT NULL REFERENCES public.indicator_definitions(key) ON DELETE CASCADE,
  current_value numeric,
  previous_value numeric,
  period_label text,
  source text,
  source_url text,
  notes text,
  status content_status NOT NULL DEFAULT 'published',
  last_updated timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(country_code, indicator_key)
);

CREATE INDEX idx_country_indicators_country ON public.country_indicators(country_code);
CREATE INDEX idx_country_indicators_indicator ON public.country_indicators(indicator_key);
CREATE INDEX idx_country_indicators_status ON public.country_indicators(status);

ALTER TABLE public.country_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published country indicators" ON public.country_indicators
  FOR SELECT USING (status = 'published'::content_status);

CREATE POLICY "auth read all country indicators" ON public.country_indicators
  FOR SELECT TO authenticated USING (can_manage(auth.uid()));

CREATE POLICY "manage write country indicators" ON public.country_indicators
  FOR ALL TO authenticated
  USING (can_manage(auth.uid()))
  WITH CHECK (can_manage(auth.uid()));

CREATE TRIGGER country_indicators_touch
BEFORE UPDATE ON public.country_indicators
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================================================
-- SEED: indicator definitions
-- =========================================================
INSERT INTO public.indicator_definitions (key, label, unit, higher_is_better, display_order, show_on_homepage, show_on_dashboard) VALUES
  ('gdp',                  'GDP',                 'USD bn', true,  10,  true, true),
  ('gdp_growth',           'GDP Growth',          '%',      true,  20,  true, true),
  ('pmi',                  'PMI',                 'points', true,  30,  true, true),
  ('unemployment',         'Unemployment',        '%',      false, 40,  true, true),
  ('inflation',            'Inflation',           '%',      false, 50,  true, true),
  ('exports',              'Exports',             'USD bn', true,  60,  true, true),
  ('business_confidence',  'Business Confidence', 'points', true,  70,  true, true),
  ('consumer_confidence',  'Consumer Confidence', 'points', true,  80,  true, true),
  ('repo_rate',            'Repo Rate',           '%',      null,  90,  false, true),
  ('g_sec_10y',            '10Y G-Sec',           '%',      null,  100, false, true),
  ('usd_inr',              'USD/INR',             '',       false, 110, false, true),
  ('forex_reserves',       'Forex Reserves',      'USD bn', true,  120, false, true);

-- =========================================================
-- SEED: countries (homepage 9 first, then full Trading Economics list)
-- =========================================================
INSERT INTO public.countries (code, name, flag_emoji, show_on_homepage, display_order) VALUES
  ('in', 'India',          '🇮🇳', true, 1),
  ('us', 'United States',  '🇺🇸', true, 2),
  ('eu', 'Eurozone',       '🇪🇺', true, 3),
  ('cn', 'China',          '🇨🇳', true, 4),
  ('jp', 'Japan',          '🇯🇵', true, 5),
  ('uk', 'United Kingdom', '🇬🇧', true, 6),
  ('au', 'Australia',      '🇦🇺', true, 7),
  ('ca', 'Canada',          '🇨🇦', true, 8),
  ('br', 'Brazil',          '🇧🇷', true, 9);

-- Full Trading Economics country list (visible only on dashboard)
INSERT INTO public.countries (code, name, flag_emoji, show_on_homepage, display_order) VALUES
  ('af','Afghanistan','🇦🇫',false,1000),('al','Albania','🇦🇱',false,1000),('dz','Algeria','🇩🇿',false,1000),
  ('ad','Andorra','🇦🇩',false,1000),('ao','Angola','🇦🇴',false,1000),('ag','Antigua and Barbuda','🇦🇬',false,1000),
  ('ar','Argentina','🇦🇷',false,1000),('am','Armenia','🇦🇲',false,1000),('aw','Aruba','🇦🇼',false,1000),
  ('at','Austria','🇦🇹',false,1000),('az','Azerbaijan','🇦🇿',false,1000),('bs','Bahamas','🇧🇸',false,1000),
  ('bh','Bahrain','🇧🇭',false,1000),('bd','Bangladesh','🇧🇩',false,1000),('bb','Barbados','🇧🇧',false,1000),
  ('by','Belarus','🇧🇾',false,1000),('be','Belgium','🇧🇪',false,1000),('bz','Belize','🇧🇿',false,1000),
  ('bj','Benin','🇧🇯',false,1000),('bm','Bermuda','🇧🇲',false,1000),('bt','Bhutan','🇧🇹',false,1000),
  ('bo','Bolivia','🇧🇴',false,1000),('ba','Bosnia and Herzegovina','🇧🇦',false,1000),('bw','Botswana','🇧🇼',false,1000),
  ('bn','Brunei','🇧🇳',false,1000),('bg','Bulgaria','🇧🇬',false,1000),('bf','Burkina Faso','🇧🇫',false,1000),
  ('bi','Burundi','🇧🇮',false,1000),('kh','Cambodia','🇰🇭',false,1000),('cm','Cameroon','🇨🇲',false,1000),
  ('cv','Cape Verde','🇨🇻',false,1000),('ky','Cayman Islands','🇰🇾',false,1000),('cf','Central African Republic','🇨🇫',false,1000),
  ('td','Chad','🇹🇩',false,1000),('cl','Chile','🇨🇱',false,1000),('co','Colombia','🇨🇴',false,1000),
  ('km','Comoros','🇰🇲',false,1000),('cg','Congo','🇨🇬',false,1000),('cd','Democratic Republic of Congo','🇨🇩',false,1000),
  ('cr','Costa Rica','🇨🇷',false,1000),('ci','Ivory Coast','🇨🇮',false,1000),('hr','Croatia','🇭🇷',false,1000),
  ('cu','Cuba','🇨🇺',false,1000),('cw','Curacao','🇨🇼',false,1000),('cy','Cyprus','🇨🇾',false,1000),
  ('cz','Czech Republic','🇨🇿',false,1000),('dk','Denmark','🇩🇰',false,1000),('dj','Djibouti','🇩🇯',false,1000),
  ('dm','Dominica','🇩🇲',false,1000),('do','Dominican Republic','🇩🇴',false,1000),('ec','Ecuador','🇪🇨',false,1000),
  ('eg','Egypt','🇪🇬',false,1000),('sv','El Salvador','🇸🇻',false,1000),('gq','Equatorial Guinea','🇬🇶',false,1000),
  ('er','Eritrea','🇪🇷',false,1000),('ee','Estonia','🇪🇪',false,1000),('sz','Eswatini','🇸🇿',false,1000),
  ('et','Ethiopia','🇪🇹',false,1000),('fj','Fiji','🇫🇯',false,1000),('fi','Finland','🇫🇮',false,1000),
  ('fr','France','🇫🇷',false,1000),('ga','Gabon','🇬🇦',false,1000),('gm','Gambia','🇬🇲',false,1000),
  ('ge','Georgia','🇬🇪',false,1000),('de','Germany','🇩🇪',false,1000),('gh','Ghana','🇬🇭',false,1000),
  ('gr','Greece','🇬🇷',false,1000),('gl','Greenland','🇬🇱',false,1000),('gd','Grenada','🇬🇩',false,1000),
  ('gt','Guatemala','🇬🇹',false,1000),('gn','Guinea','🇬🇳',false,1000),('gw','Guinea-Bissau','🇬🇼',false,1000),
  ('gy','Guyana','🇬🇾',false,1000),('ht','Haiti','🇭🇹',false,1000),('hn','Honduras','🇭🇳',false,1000),
  ('hk','Hong Kong','🇭🇰',false,1000),('hu','Hungary','🇭🇺',false,1000),('is','Iceland','🇮🇸',false,1000),
  ('id','Indonesia','🇮🇩',false,1000),('ir','Iran','🇮🇷',false,1000),('iq','Iraq','🇮🇶',false,1000),
  ('ie','Ireland','🇮🇪',false,1000),('il','Israel','🇮🇱',false,1000),('it','Italy','🇮🇹',false,1000),
  ('jm','Jamaica','🇯🇲',false,1000),('jo','Jordan','🇯🇴',false,1000),('kz','Kazakhstan','🇰🇿',false,1000),
  ('ke','Kenya','🇰🇪',false,1000),('xk','Kosovo','🇽🇰',false,1000),('kw','Kuwait','🇰🇼',false,1000),
  ('kg','Kyrgyzstan','🇰🇬',false,1000),('la','Laos','🇱🇦',false,1000),('lv','Latvia','🇱🇻',false,1000),
  ('lb','Lebanon','🇱🇧',false,1000),('ls','Lesotho','🇱🇸',false,1000),('lr','Liberia','🇱🇷',false,1000),
  ('ly','Libya','🇱🇾',false,1000),('li','Liechtenstein','🇱🇮',false,1000),('lt','Lithuania','🇱🇹',false,1000),
  ('lu','Luxembourg','🇱🇺',false,1000),('mo','Macau','🇲🇴',false,1000),('mk','North Macedonia','🇲🇰',false,1000),
  ('mg','Madagascar','🇲🇬',false,1000),('mw','Malawi','🇲🇼',false,1000),('my','Malaysia','🇲🇾',false,1000),
  ('mv','Maldives','🇲🇻',false,1000),('ml','Mali','🇲🇱',false,1000),('mt','Malta','🇲🇹',false,1000),
  ('mr','Mauritania','🇲🇷',false,1000),('mu','Mauritius','🇲🇺',false,1000),('mx','Mexico','🇲🇽',false,1000),
  ('md','Moldova','🇲🇩',false,1000),('mc','Monaco','🇲🇨',false,1000),('mn','Mongolia','🇲🇳',false,1000),
  ('me','Montenegro','🇲🇪',false,1000),('ma','Morocco','🇲🇦',false,1000),('mz','Mozambique','🇲🇿',false,1000),
  ('mm','Myanmar','🇲🇲',false,1000),('na','Namibia','🇳🇦',false,1000),('np','Nepal','🇳🇵',false,1000),
  ('nl','Netherlands','🇳🇱',false,1000),('nz','New Zealand','🇳🇿',false,1000),('ni','Nicaragua','🇳🇮',false,1000),
  ('ne','Niger','🇳🇪',false,1000),('ng','Nigeria','🇳🇬',false,1000),('kp','North Korea','🇰🇵',false,1000),
  ('no','Norway','🇳🇴',false,1000),('om','Oman','🇴🇲',false,1000),('pk','Pakistan','🇵🇰',false,1000),
  ('ps','Palestine','🇵🇸',false,1000),('pa','Panama','🇵🇦',false,1000),('pg','Papua New Guinea','🇵🇬',false,1000),
  ('py','Paraguay','🇵🇾',false,1000),('pe','Peru','🇵🇪',false,1000),('ph','Philippines','🇵🇭',false,1000),
  ('pl','Poland','🇵🇱',false,1000),('pt','Portugal','🇵🇹',false,1000),('pr','Puerto Rico','🇵🇷',false,1000),
  ('qa','Qatar','🇶🇦',false,1000),('ro','Romania','🇷🇴',false,1000),('ru','Russia','🇷🇺',false,1000),
  ('rw','Rwanda','🇷🇼',false,1000),('ws','Samoa','🇼🇸',false,1000),('sm','San Marino','🇸🇲',false,1000),
  ('st','Sao Tome and Principe','🇸🇹',false,1000),('sa','Saudi Arabia','🇸🇦',false,1000),('sn','Senegal','🇸🇳',false,1000),
  ('rs','Serbia','🇷🇸',false,1000),('sc','Seychelles','🇸🇨',false,1000),('sl','Sierra Leone','🇸🇱',false,1000),
  ('sg','Singapore','🇸🇬',false,1000),('sk','Slovakia','🇸🇰',false,1000),('si','Slovenia','🇸🇮',false,1000),
  ('sb','Solomon Islands','🇸🇧',false,1000),('so','Somalia','🇸🇴',false,1000),('za','South Africa','🇿🇦',false,1000),
  ('kr','South Korea','🇰🇷',false,1000),('ss','South Sudan','🇸🇸',false,1000),('es','Spain','🇪🇸',false,1000),
  ('lk','Sri Lanka','🇱🇰',false,1000),('sd','Sudan','🇸🇩',false,1000),('sr','Suriname','🇸🇷',false,1000),
  ('se','Sweden','🇸🇪',false,1000),('ch','Switzerland','🇨🇭',false,1000),('sy','Syria','🇸🇾',false,1000),
  ('tw','Taiwan','🇹🇼',false,1000),('tj','Tajikistan','🇹🇯',false,1000),('tz','Tanzania','🇹🇿',false,1000),
  ('th','Thailand','🇹🇭',false,1000),('tl','Timor-Leste','🇹🇱',false,1000),('tg','Togo','🇹🇬',false,1000),
  ('to','Tonga','🇹🇴',false,1000),('tt','Trinidad and Tobago','🇹🇹',false,1000),('tn','Tunisia','🇹🇳',false,1000),
  ('tr','Turkey','🇹🇷',false,1000),('tm','Turkmenistan','🇹🇲',false,1000),('ug','Uganda','🇺🇬',false,1000),
  ('ua','Ukraine','🇺🇦',false,1000),('ae','United Arab Emirates','🇦🇪',false,1000),('uy','Uruguay','🇺🇾',false,1000),
  ('uz','Uzbekistan','🇺🇿',false,1000),('vu','Vanuatu','🇻🇺',false,1000),('ve','Venezuela','🇻🇪',false,1000),
  ('vn','Vietnam','🇻🇳',false,1000),('ye','Yemen','🇾🇪',false,1000),('zm','Zambia','🇿🇲',false,1000),
  ('zw','Zimbabwe','🇿🇼',false,1000);

-- =========================================================
-- SEED: country_indicators for the 9 homepage countries
-- (preserves the exact values currently displayed)
-- =========================================================
INSERT INTO public.country_indicators (country_code, indicator_key, current_value, previous_value, period_label, source) VALUES
  -- India
  ('in','gdp',3740,3540,'2023','MoSPI'),
  ('in','gdp_growth',8.4,7.8,'Q4/23','MoSPI'),
  ('in','inflation',4.9,5.2,'Mar/24','MoSPI'),
  ('in','unemployment',8.1,7.8,'Mar/24','CMIE'),
  ('in','pmi',59.1,57.8,'Apr/24','S&P Global'),
  ('in','exports',41.4,40.1,'Mar/24','MoCI'),
  ('in','business_confidence',55.2,54.4,'Apr/24','RBI'),
  ('in','consumer_confidence',98.5,97.3,'Apr/24','RBI'),
  ('in','repo_rate',6.50,6.50,'Apr/24','RBI'),
  ('in','g_sec_10y',7.14,7.18,'Apr/24','RBI'),
  ('in','usd_inr',83.02,83.26,'Apr/24','RBI'),
  ('in','forex_reserves',642,640,'Apr/24','RBI'),
  -- US
  ('us','gdp',27360,26900,'2023','BEA'),
  ('us','gdp_growth',2.5,2.3,'Q4/23','BEA'),
  ('us','inflation',3.5,3.7,'Mar/24','BLS'),
  ('us','unemployment',3.8,3.7,'Mar/24','BLS'),
  ('us','pmi',51.2,50.4,'Apr/24','S&P Global'),
  ('us','exports',266.4,264.0,'Feb/24','BEA'),
  ('us','business_confidence',52.8,53.3,'Apr/24','ISM'),
  ('us','consumer_confidence',104.7,102.6,'Apr/24','Conf Board'),
  -- Eurozone
  ('eu','gdp',14520,14460,'2023','Eurostat'),
  ('eu','gdp_growth',0.3,0.2,'Q4/23','Eurostat'),
  ('eu','inflation',2.4,2.5,'Mar/24','Eurostat'),
  ('eu','unemployment',6.5,6.6,'Feb/24','Eurostat'),
  ('eu','pmi',51.5,50.3,'Apr/24','S&P Global'),
  ('eu','exports',211.3,209.5,'Feb/24','Eurostat'),
  ('eu','business_confidence',50.2,49.9,'Apr/24','EC'),
  ('eu','consumer_confidence',-14.9,-15.4,'Apr/24','EC'),
  -- China
  ('cn','gdp',17800,17600,'2023','NBS'),
  ('cn','gdp_growth',5.3,5.0,'Q1/24','NBS'),
  ('cn','inflation',0.7,0.3,'Mar/24','NBS'),
  ('cn','unemployment',5.3,5.2,'Mar/24','NBS'),
  ('cn','pmi',50.4,50.6,'Apr/24','NBS'),
  ('cn','exports',280.1,278.3,'Mar/24','GAC'),
  ('cn','business_confidence',51.8,52.2,'Apr/24','NBS'),
  ('cn','consumer_confidence',87.2,88.7,'Apr/24','NBS'),
  -- Japan
  ('jp','gdp',4230,4180,'2023','Cabinet Office'),
  ('jp','gdp_growth',1.2,1.3,'Q4/23','Cabinet Office'),
  ('jp','inflation',2.8,3.0,'Mar/24','MIC'),
  ('jp','unemployment',2.6,2.6,'Mar/24','MIC'),
  ('jp','pmi',49.8,50.3,'Apr/24','au Jibun'),
  ('jp','exports',68.5,66.7,'Mar/24','MoF'),
  ('jp','business_confidence',48.5,49.7,'Apr/24','BoJ Tankan'),
  ('jp','consumer_confidence',36.2,35.4,'Apr/24','Cabinet Office'),
  -- UK
  ('uk','gdp',3330,3290,'2023','ONS'),
  ('uk','gdp_growth',0.2,0.1,'Q4/23','ONS'),
  ('uk','inflation',3.2,3.5,'Mar/24','ONS'),
  ('uk','unemployment',3.9,3.9,'Feb/24','ONS'),
  ('uk','pmi',52.8,51.3,'Apr/24','S&P Global'),
  ('uk','exports',52.4,51.1,'Feb/24','ONS'),
  ('uk','business_confidence',51.2,50.4,'Apr/24','BCC'),
  ('uk','consumer_confidence',-21.0,-22.5,'Apr/24','GfK'),
  -- Australia
  ('au','gdp',1690,1660,'2023','ABS'),
  ('au','gdp_growth',1.5,1.7,'Q4/23','ABS'),
  ('au','inflation',3.6,4.0,'Mar/24','ABS'),
  ('au','unemployment',3.8,3.9,'Mar/24','ABS'),
  ('au','pmi',50.1,49.8,'Apr/24','S&P Global'),
  ('au','exports',42.8,41.5,'Mar/24','ABS'),
  ('au','business_confidence',49.8,50.3,'Apr/24','NAB'),
  ('au','consumer_confidence',82.4,84.5,'Apr/24','Westpac'),
  -- Canada
  ('ca','gdp',2140,2100,'2023','StatCan'),
  ('ca','gdp_growth',1.2,1.1,'Q4/23','StatCan'),
  ('ca','inflation',2.9,3.1,'Mar/24','StatCan'),
  ('ca','unemployment',6.1,5.9,'Mar/24','StatCan'),
  ('ca','pmi',50.6,50.2,'Apr/24','S&P Global'),
  ('ca','exports',52.1,51.3,'Feb/24','StatCan'),
  ('ca','business_confidence',51.5,51.3,'Apr/24','CFIB'),
  ('ca','consumer_confidence',89.2,91.0,'Apr/24','Conf Board'),
  -- Brazil
  ('br','gdp',2170,2120,'2023','IBGE'),
  ('br','gdp_growth',2.9,2.5,'Q4/23','IBGE'),
  ('br','inflation',3.8,4.1,'Mar/24','IBGE'),
  ('br','unemployment',7.8,8.0,'Mar/24','IBGE'),
  ('br','pmi',48.5,49.3,'Apr/24','S&P Global'),
  ('br','exports',24.8,23.5,'Mar/24','MDIC'),
  ('br','business_confidence',47.2,48.7,'Apr/24','FGV'),
  ('br','consumer_confidence',92.8,90.7,'Apr/24','FGV');
