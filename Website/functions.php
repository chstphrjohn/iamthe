<?php

function wptutsplus_theme_support() {
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'wptutsplus_theme_support' );

function new_excerpt_more( $more ) {
	return '... ';
}
add_filter('excerpt_more', 'new_excerpt_more');

add_filter('excerpt_length', 'my_excerpt_length');

function my_excerpt_length($length) {
return 21; // Or whatever you want the length to be.
}

add_filter( 'the_content', 'attachment_image_link_remove_filter' );
function attachment_image_link_remove_filter( $content ) {
 $content =
 preg_replace(
 array('{<a(.*?)(wp-att|wp-content/uploads)[^>]*><img}',
 '{ wp-image-[0-9]*" /></a>}'),
 array('<img','" />'),
 $content
 );
 return $content;
 }

add_filter( 'use_default_gallery_style', '__return_false' );



?>


