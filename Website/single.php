<?php
/**
Template Name Posts: Subpage
*/
?>

<div class="wrapper">
<?php include ("includes/Header.php") ; ?>

<main> 
	<article>
		<section class="content">

			<div class="wrapper">

				<div class="post_content_sub">

					<div class="column-1">

						<div class="fixed-section">
							<!-- Start the Loop. -->
							<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

								<div class="post_text">
									<h1><?php the_title(); ?></h1>
									<?php the_content(); ?>
								</div>

								<!-- Stop The Loop (but note the "else:" - see next line). -->

							<?php endwhile; else : ?>

								<!-- REALLY stop The Loop. -->
							<?php endif; ?>
						</div>

					</div>

					<div class="column-2">

						<div class="images-section">
						<!-- Start the Loop. -->
						<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

							<?php the_post_thumbnail( 'auto', array( 'class' => 'left',
								'alt'   => trim( strip_tags( $wp_postmeta->_wp_attachment_image_alt ) )
							) ); ?>

							<!-- Display the Title as a link to the Post's permalink. -->

							<?php the_secondary_content(); ?>

							<!-- Stop The Loop (but note the "else:" - see next line). -->

						<?php endwhile; else : ?>

							<!-- REALLY stop The Loop. -->
						<?php endif; ?>
						</div>

					</div>



				</div>
				
				<div class="back_button"> <a href="/" alt="Link to iamtheconnoisseur homepage - for mens casual fashion - Casuals Blog" ><p>Back to Homepage</p></a></div>


			</div><!--end wrapper-->

		</section>			
	</article>
	<!--end of tiles-->
	<div class="clear_both"></div>

	<?php include ("includes/Footer.php") ; ?>

</main>
</div>