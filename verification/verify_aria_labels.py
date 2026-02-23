from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080/")

        print("Page loaded")

        # Wait for the page to load
        page.wait_for_selector("text=Workout", timeout=10000)

        # Click on "Add your first exercise" or "Add Exercise"
        try:
            # Try to find the button for empty state
            add_btn = page.locator("button", has_text="Add your first exercise")
            if add_btn.is_visible():
                add_btn.click()
            else:
                # Try the other button
                page.click("button:has-text('Add Exercise')")
        except Exception as e:
            print(f"Error clicking add button: {e}")
            # Maybe the page structure is different, let's take a screenshot to debug
            page.screenshot(path="verification/debug_error.png")
            raise e

        # Wait for exercise item to appear
        page.wait_for_selector('input[placeholder="Exercise name"]')

        # Check for aria-label on Exercise Name input
        exercise_name_input = page.locator('input[placeholder="Exercise name"]').first
        aria_label_name = exercise_name_input.get_attribute("aria-label")
        print(f"Exercise Name aria-label: {aria_label_name}")
        assert aria_label_name == "Exercise name"

        # Check for aria-label on Collapse/Expand button
        # It defaults to expanded
        collapse_btn = page.locator('button[aria-label="Collapse exercise"]').first
        print(f"Collapse/Expand button found: {collapse_btn.is_visible()}")
        assert collapse_btn.is_visible()

        # Check for Delete Exercise button
        delete_exercise_btn = page.locator('button[aria-label="Delete exercise"]').first
        print(f"Delete Exercise button found: {delete_exercise_btn.is_visible()}")
        assert delete_exercise_btn.is_visible()

        # Add a Set
        page.click("text=Add Set")

        # Wait for SetRow
        page.wait_for_selector('input[placeholder="kg"]')

        # Check for Weight input aria-label
        weight_input = page.locator('input[placeholder="kg"]').first
        aria_label_weight = weight_input.get_attribute("aria-label")
        print(f"Weight Input aria-label: {aria_label_weight}")
        assert aria_label_weight == "Weight for set 1"

        # Check for Reps input aria-label
        reps_input = page.locator('input[placeholder="#"]').first
        aria_label_reps = reps_input.get_attribute("aria-label")
        print(f"Reps Input aria-label: {aria_label_reps}")
        assert aria_label_reps == "Reps for set 1"

        # Check for RIR Slider
        # ShadCN slider root is a span
        rir_slider = page.locator('span[aria-label="RIR for set 1"]').first
        print(f"RIR Slider found: {rir_slider.is_visible()}")
        assert rir_slider.is_visible()

        # Check for Delete Set button
        delete_set_btn = page.locator('button[aria-label="Delete set 1"]').first
        print(f"Delete Set button found: {delete_set_btn.is_visible()}")
        assert delete_set_btn.is_visible()

        # Take screenshot
        page.screenshot(path="verification/verification.png")
        print("Screenshot saved to verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run()
