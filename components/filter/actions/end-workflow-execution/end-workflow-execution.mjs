import filter from "../../filter.app.mjs";
import {
  constants,
  binaryConditions,
} from "../../common/conditions.mjs";

export default {
  name: "Filter Based on Condition",
  version: "0.0.1",
  key: "filter-end-workflow-execution",
  description: "Continue or end workflow execution based on a condition",
  type: "action",
  props: {
    filter,
    continueOrEnd: {
      type: "string",
      label: "Continue or end execution?",
      description: "Specify whether you'd like to **continue** or **end** workflow execution when the below condition is met",
      options: [
        constants.CONTINUE,
        constants.END,
      ],
    },
    messageOnContinue: {
      type: "string",
      label: "Reason for continuing",
      description: "Return a message indicating why workflow execution **continued**",
      optional: true,
    },
    messageOnEnd: {
      type: "string",
      label: "Reason for ending",
      description: "Return a message indicating why workflow execution **ended**",
      optional: true,
    },
    initialValue: {
      type: "any",
      label: "Initial value",
      description: "The 1st of 2 values to compare",
    },
    condition: {
      propDefinition: [
        filter,
        "condition",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (binaryConditions.map(({ value }) => value).includes(this.condition)) {
      props.secondValue = {
        type: "any",
        label: "Second value",
        description: "The 2nd of 2 values to compare",
      };
    }
    return props;
  },
  methods: {
    consolidateResult($, result) {
      const shouldExit =
        (result && this.continueOrEnd === constants.END) ||
        (!result && this.continueOrEnd === constants.CONTINUE);

      if (shouldExit) {
        $.flow.exit(this.messageOnEnd);
      } else {
        return this.messageOnContinue;
      }
    },
  },
  async run({ $ }) {
    const result = this.filter.checkCondition(
      this.condition,
      this.initialValue,
      this.secondValue,
    );
    return this.consolidateResult($, result);
  },
};