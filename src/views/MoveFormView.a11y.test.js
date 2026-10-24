import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import MoveFormView from "./MoveFormView.vue";

describe("MoveFormView accessibility", () => {
  it("associates the postal code error with its input", async () => {
    const wrapper = mount(MoveFormView, {
      global: {
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    });

    // Hitta postnummerfältet via dess label.
    const postalCodeInput = wrapper.find(
      'input[name="postalCode"], input[name="zip"], input[id*="zip"]',
    );

    if (!postalCodeInput.exists()) {
      // Visa användbart fel om projektet använder ett annat fältnamn.
      expect(
        wrapper.findAll("input").length,
        "Hittade inga inputfält. Kontrollera hur postnummerfältet renderas.",
      ).toBeGreaterThan(0);
    }

    expect(postalCodeInput.exists()).toBe(true);

    await postalCodeInput.setValue("123");
    await postalCodeInput.trigger("blur");
    await nextTick();

    expect(wrapper.text()).toContain(
      "Postnumret ska innehålla exakt 5 siffror.",
    );

    const describedBy = postalCodeInput.attributes("aria-describedby");

    expect(describedBy).toBeTruthy();

    const errorId = describedBy?.split(/\s+/).find((id) => {
      return wrapper.find(`#${id}`).exists();
    });

    expect(errorId).toBeTruthy();
    expect(wrapper.find(`#${errorId}`).text()).toContain(
      "Postnumret ska innehålla exakt 5 siffror.",
    );

    wrapper.unmount();
  });
});
