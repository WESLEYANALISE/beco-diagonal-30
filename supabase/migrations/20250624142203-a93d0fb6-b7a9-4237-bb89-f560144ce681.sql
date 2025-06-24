
-- Create table to track product clicks
CREATE TABLE public.product_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id BIGINT NOT NULL,
  user_id UUID REFERENCES public.app_users(id) ON DELETE SET NULL,
  device_id TEXT NOT NULL,
  click_type TEXT NOT NULL DEFAULT 'video_view',
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (allows anonymous users)
CREATE POLICY "Anyone can insert clicks" ON public.product_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view clicks" ON public.product_clicks
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_product_clicks_product_id ON public.product_clicks(product_id);
CREATE INDEX idx_product_clicks_clicked_at ON public.product_clicks(clicked_at DESC);
CREATE INDEX idx_product_clicks_device_id ON public.product_clicks(device_id);

-- Create function to get most clicked products with videos
CREATE OR REPLACE FUNCTION get_most_clicked_products_with_videos(limit_count INTEGER DEFAULT 12)
RETURNS TABLE (
  id BIGINT,
  produto TEXT,
  valor TEXT,
  video TEXT,
  imagem1 TEXT,
  imagem2 TEXT,
  imagem3 TEXT,
  imagem4 TEXT,
  imagem5 TEXT,
  link TEXT,
  categoria TEXT,
  click_count BIGINT
) 
LANGUAGE SQL
STABLE
AS $$
  WITH product_click_counts AS (
    SELECT 
      pc.product_id,
      COUNT(*) as click_count
    FROM public.product_clicks pc
    WHERE pc.clicked_at >= NOW() - INTERVAL '30 days' -- Last 30 days
    GROUP BY pc.product_id
  )
  SELECT 
    s.id,
    s.produto,
    s.valor,
    s.video,
    s.imagem1,
    s.imagem2,
    s.imagem3,
    s.imagem4,
    s.imagem5,
    s.link,
    s.categoria,
    COALESCE(pcc.click_count, 0) as click_count
  FROM public."SHOPEE" s
  LEFT JOIN product_click_counts pcc ON s.id = pcc.product_id
  WHERE s.video IS NOT NULL AND s.video != ''
  ORDER BY COALESCE(pcc.click_count, 0) DESC, RANDOM()
  LIMIT limit_count;
$$;
