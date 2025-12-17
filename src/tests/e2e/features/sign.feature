Feature: User authorization

  Scenario: User signs in
    Given I am on the sign in page
    When I fill in the sign in form with valid credentials
    And I click the sign in button
    Then I am successfully signed in

  Scenario: New user signs up
    Given I am on the sign up page
    When I fill in the sign up form with valid data
    And I click the sign up button
    Then I am successfully registered
