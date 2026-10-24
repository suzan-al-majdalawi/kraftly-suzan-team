import KButton from "./KButton.vue";

export default {
  title: "Components/KButton",
  component: KButton,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "success"],
    },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export const Primary = {
  args: {
    variant: "primary",
    type: "button",
    disabled: false,
  },
  render: (args) => ({
    components: { KButton },
    setup() {
      return { args };
    },
    template: '<KButton v-bind="args">Primär knapp</KButton>',
  }),
};

export const Secondary = {
  args: {
    variant: "secondary",
    type: "button",
    disabled: false,
  },
  render: (args) => ({
    components: { KButton },
    setup() {
      return { args };
    },
    template: '<KButton v-bind="args">Sekundär knapp</KButton>',
  }),
};

export const Success = {
  args: {
    variant: "success",
    type: "button",
    disabled: false,
  },
  render: (args) => ({
    components: { KButton },
    setup() {
      return { args };
    },
    template: '<KButton v-bind="args">Spara ändringar</KButton>',
  }),
};

export const Disabled = {
  args: {
    variant: "primary",
    type: "button",
    disabled: true,
  },
  render: (args) => ({
    components: { KButton },
    setup() {
      return { args };
    },
    template: '<KButton v-bind="args">Inaktiverad knapp</KButton>',
  }),
};
