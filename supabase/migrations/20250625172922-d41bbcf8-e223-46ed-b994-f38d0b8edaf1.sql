
-- Atualizar função para buscar produtos da tabela "HARRY POTTER" em vez de "SHOPEE"
CREATE OR REPLACE FUNCTION public.get_most_clicked_products_with_videos(limit_count integer DEFAULT 12)
 RETURNS TABLE(id bigint, produto text, valor text, video text, imagem1 text, imagem2 text, imagem3 text, imagem4 text, imagem5 text, link text, categoria text, click_count bigint)
 LANGUAGE sql
 STABLE
AS $function$
  WITH product_click_counts AS (
    SELECT 
      pc.product_id,
      COUNT(*) as click_count
    FROM public.product_clicks pc
    WHERE pc.clicked_at >= NOW() - INTERVAL '30 days' -- Last 30 days
    GROUP BY pc.product_id
  )
  SELECT 
    hp.id,
    hp.produto,
    hp.valor,
    hp.video,
    hp.imagem1,
    hp.imagem2,
    hp.imagem3,
    hp.imagem4,
    hp.imagem5,
    hp.link,
    hp.categoria,
    COALESCE(pcc.click_count, 0) as click_count
  FROM public."HARRY POTTER" hp
  LEFT JOIN product_click_counts pcc ON hp.id = pcc.product_id
  WHERE hp.video IS NOT NULL AND hp.video != ''
  ORDER BY COALESCE(pcc.click_count, 0) DESC, RANDOM()
  LIMIT limit_count;
$function$;
