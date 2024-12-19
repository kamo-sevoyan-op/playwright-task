The task is to write an automation test suite to verify that the following test cases are working correctly.

- User is able to navigate to homepage and view products without authentication
- User is able to sign in successfully, — assert on Welcome, [username] message is visible 
- User can search on a specific product
- Verify all search result should contain the search term - (search for “backpack”)
- Can navigate to a product page, verify that the correct page is opened — assert for product name
- User can add a product to Cart
- Verify that the product is added to the cart “checkout/cart/” — assert for product name
- Can empty the cart - assert for “You have no items in your shopping cart.” Message
- Add another product and proceed to checkout “/checkout/#shipping”
- Finish checkout and place order — assert for Thank you for your purchase! And Your order number is: <order number>.
- Verify that the order is visible in orders history page with order number and price “sales/order/history/“