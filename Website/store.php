<?php
/**
Template Name: StorePage
*/
?>
<?php include ("includes/Header.php") ; ?>

<main> 
	<article>
		<section class="content">

			<div class="wrapper">

				<div class="post_content_sub">

						<?php

							$my_id = 637;
							$post_id = get_post($my_id);
							$content = $post_id->post_content;
							$content = apply_filters('the_content', $content);
							$content = str_replace(']]>', ']]>', $content);
							$title = $post->post_title;
						?>
						 	<!-- Display the Title as a link to the Post's permalink. -->

						 	<h1><?php echo $page->post_title; ?></h1>

						 	<!-- Display the Post's content in a div box. -->

						 	<div class="post_text">
						 		<h1><?php echo $title ?></h1>
						 		<p>
						 		<?php echo $content; ?>
						 		</p>
						 	</div>


				</div>
				
			</div><!--end wrapper-->

		</section>			
	</article>
	<!--end of tiles-->
	<div class="clear_both"></div>

	<?php include ("includes/Footer.php") ; ?>

</main>
