<?php
/**
 * Plugin Name:       ACBA-Slider
 * Description:       The ACBA-Slider plugin is a handy tool for WordPress users to create a slider that compares two images. It's perfect for showing before and after photos, making it great for photographers, designers, and anyone who wants to highlight changes visually.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.0
 * Author:            Ingmar van Rheenen
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ACBA-slider
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

add_action('wp_enqueue_scripts', function(){
    wp_enqueue_style('acb-index-style', plugin_dir_url(__FILE__) . 'assets/index.css');
    wp_enqueue_script('acb-script', plugin_dir_url(__FILE__) . 'assets/baslider.js', array('jquery'), null, true);
});

add_action('enqueue_block_editor_assets', function(){
    wp_enqueue_style('acb-editor-style', plugin_dir_url(__FILE__) . 'assets/editor.css');
});

add_action( 'init', function(){
    register_block_type( __DIR__ . '/build/acba-slider' );
} );