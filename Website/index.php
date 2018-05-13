<?php
/**
Template Name: Home
*/
?>
<div class="wrapper">
<?php include ("includes/Header.php") ; ?>

<main> 

	<article>
		<section class="content">

				<div class="wrapper">

                    <div class="column a">

                        <div class="block">

                            <div class="post_content">

                                <?php
                                $args = array ('posts_per_page'=> -1, 'category' => 'cat=4');
                                $pageposts = get_posts( $args );
                                foreach ( $pageposts as $post ) : setup_postdata ( $post ) ;
                                    ?>

                                    <div class="text_post">
                                        <a href="<?php the_permalink(); ?>">
                                            <?php the_post_thumbnail( 'auto', array( 'class' => 'left',
                                                'alt'   => trim( strip_tags( $wp_postmeta->_wp_attachment_image_alt ) )
                                            ) ); ?>
                                        </a>
                                        <a href="<?php the_permalink(); ?>" alt="<?php the_title(); ?>">
                                            <span class="posttitle"><?php the_title(); ?></span>
                                        </a>
                                        <span class="postcontent"><?php the_excerpt(); ?></span>
                                    </div>

                                    <?php
                                endforeach;
                                wp_reset_postdata();
                                ?>
                            </div>

                        </div>
                    </div>

                    <div class="column b">

                        <div class="block">

                            <div class="post_content">

                                <?php
                                $args = array ('posts_per_page'=> -1, 'category' => 'cat=3');
                                $pageposts = get_posts( $args );
                                foreach ( $pageposts as $post ) : setup_postdata ( $post ) ;
                                    ?>

                                    <div>

                                        <a href="<?php the_permalink(); ?>">
                                            <?php the_post_thumbnail( 'auto', array( 'class' => 'left',
                                                'alt'   => trim( strip_tags( $wp_postmeta->_wp_attachment_image_alt ) )
                                            ) ); ?>
                                        </a>
                                        <a href="<?php the_permalink(); ?>" alt="<?php the_title(); ?>">
                                            <span class="posttitle"><?php the_title(); ?></span>
                                        </a>
                                        <span class="postcontent"><?php the_excerpt(); ?></span>


                                    </div>

                                    <?php
                                endforeach;
                                wp_reset_postdata();
                                ?>
                            </div>

                        </div>
                    </div>

					<div class="column hidden">

						<div class="block">

							<div class="post_content">
										
										<?php 
										$args = array ('posts_per_page'=> -1);
										$pageposts = get_posts( $args );
										foreach ( $pageposts as $post ) : setup_postdata ( $post ) ;
										?>

										<div>

										<a href="<?php the_permalink(); ?>">
								    		<?php the_post_thumbnail( 'auto', array( 'class' => 'left',
								            'alt'   => trim( strip_tags( $wp_postmeta->_wp_attachment_image_alt ) )
								    	    ) ); ?> 
							    		</a>
							    		<a href="<?php the_permalink(); ?>" alt="<?php the_title(); ?>">
											<span class="posttitle"><h2><?php the_title(); ?></h2></span>
										</a>
											<span class="postcontent"><?php the_excerpt(); ?></span>
										

										</div>

										<?php
										endforeach;
										wp_reset_postdata();
										?>
							</div>

						</div>
					</div>

				</div><!--end wrapper-->

		</section>			
	</article>
	<!--end of tiles-->
	<?php include ("includes/Footer.php") ; ?>

</main>
</div>
<!--<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>-->
<!--<script>window.jQuery || document.write('<script src="/ui/eml/js/jquery-1.11.3.min.js"><\/script>')</script>-->
<!--<script src="/wp-content/themes/iamtheconnoisseur/Website/ui/connoisseur/js/connoisseur-gallery.js"></script>-->
<!--<script src="/wp-content/themes/iamtheconnoisseur/Website/ui/connoisseur/js/gallery-plugins.js"></script>-->

<!--


<div class="gridLayout">
                    	<div class="grid-sizer"></div>

                    	<?php
$args = array ('posts_per_page'=> -1);
$pageposts = get_posts( $args );
foreach ( $pageposts as $post ) : setup_postdata ( $post ) ;
    global $post;
    $src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), array( 5600,1000 ), false, '' );
    ?>

                    		<a href="<?php the_permalink(); ?>" class="postBlock">

                            <div class="text_overlay">
                  				<div class="postText">
                 					<div alt="<?php the_title(); ?>">
                                        <span class="posttitle"><h2><?php the_title(); ?></h2></span>
                                    </div>
                                    <span class="postcontent"><?php the_excerpt(); ?></span>
                                </div>
                            </div>

                    		</a>

                        <?php
endforeach;
wp_reset_postdata();
?>

                    </div>




<!---->
<!--		--><?php
//	endforeach;
//	wp_reset_postdata();
//	?>
<!--

<div class="img-holder mask post_tile" style="background: url(<?php echo $src[0]; ?>) no-repeat center;background-size: cover;"></div>


-->
<!--</div>-->



<!--<div class="content full-width">-->
<!--    <div class="grid archive-grid ">-->
<!---->
<!--        <div class="grid-container">-->
<!---->
<!--            --><?php
//            $args = array ('posts_per_page'=> -1);
//            $pageposts = get_posts( $args );
//            foreach ( $pageposts as $post ) : setup_postdata ( $post ) ;
//                global $post;
//                $src = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), array( 5600,1000 ), false, '' );
//                ?>
<!---->
<!--                <a href="--><?php //the_permalink(); ?><!--">-->
<!--                    <div class="thumb post_tile">-->
<!--                        <div class="mask">-->
<!--                            <img src="--><?php //echo $src[0]; ?><!--"/>-->
<!--                            <div class="text_overlay">-->
<!--                                <div class="postText">-->
<!--                                    <div alt="--><?php //the_title(); ?><!--">-->
<!--                                        <span class="posttitle"><h2>--><?php //the_title(); ?><!--</h2></span>-->
<!--                                    </div>-->
<!--                                    <span class="postcontent">--><?php //the_excerpt(); ?><!--</span>-->
<!--                                </div>-->
<!--                            </div>-->
<!---->
<!--                        </div>-->
<!---->
<!--                    </div>-->
<!--                </a>-->
<!---->
<!--                --><?php
//            endforeach;
//            wp_reset_postdata();
//            ?>
<!---->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->