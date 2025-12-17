# Feature: Admin movie management

#   Scenario: Admin adds a new movie
#     Given I am logged in as an admin
#     And I am on the admin dashboard
#     When I add a new movie with valid data
#     Then I see the movie in the movie list

  # Scenario: Admin edits an existing movie
  #   Given I am logged in as an admin
  #   And I am on the admin dashboard
  #   And a movie "Blade Runner 2049" exists
  #   When I update the movie description
  #   Then I see the updated movie details

  # Scenario: Admin deletes a movie
  #   Given I am logged in as an admin
  #   And I am on the admin dashboard
  #   And a movie "Blade Runner 2049" exists
  #   When I delete the movie
  #   Then the movie is no longer visible in the movie list

  # Scenario: Normal user cannot access admin dashboard
  #   Given I am logged in as a normal user
  #   When I try to access the admin dashboard
  #   Then I see an access denied message

  # Scenario: Admin cannot add a movie with missing required fields
  #   Given I am logged in as an admin
  #   And I am on the admin dashboard
  #   When I add a movie without a title
  #   Then I see a validation error message
