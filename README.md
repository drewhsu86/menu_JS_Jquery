# menu_JS_Jquery
An example restaurant menu management system in Javascript and Jquery (art by me!)
Backend using Firebase

##### Deployed on Surge
[Customer Facing Menu](https://drewhsu86-menu-system-demo.surge.sh) 

[Admin Page (admin/password)](https://drewhsu86-menu-system-demo.surge.sh/menu.html)

HTML File Guide:

1) index.html: site that the CUSTOMER interfaces with. 
  The customer may choose existing dishes to add to an order.
  They may submit the order (order info saved to Firebase) and taken to submittal.html.
  
2) menu.html: site that the RESTAURANT MANAGER interfaces with.
  Dishes can be added with name, price, description, image.
  Existing dishes (displayed in a grid) can be removed or edited.
  Going to the bottom will show a list of orders (submitted from index.html) by customers.
  
3) submittal.html: page that lets customers know they've submitted an order
  The only purpose of this page is to bring them back to index.html after letting them know their order has been processed.
  This page also has a fake "order processing" animation done in Javascript.
