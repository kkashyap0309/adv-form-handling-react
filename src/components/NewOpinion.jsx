import { useActionState, useContext } from "react";
import { OpinionsContext } from "../store/opinions-context";
import Submit from "./Submit";

export function NewOpinion() {
  const { addOpinion } = useContext(OpinionsContext);

  async function opinionFormSubmissionAction(prevFormState, formData) {
    const userName = formData.get("userName");
    const title = formData.get("title");
    const body = formData.get("body");
    const errors = [];

    if (userName === "") {
      errors.push("Enter username");
    }

    if (title === "") {
      errors.push("Enter title");
    }

    if (body === "") {
      errors.push("Enter opinion");
    }

    if (errors.length > 0) {
      return { errors, enterdValues: { userName, title, body } };
    }

    //submit form
    await addOpinion({ userName, title, body });

    //if the data has been submitted then only clear the form
    return { errors: null };
  }

  const [formState, formAction] = useActionState(opinionFormSubmissionAction, {
    errors: null,
  });

  return (
    <div id="new-opinion">
      <h2>Share your opinion!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Your Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              defaultValue={formState.enterdValues?.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={formState.enterdValues?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea
            id="body"
            name="body"
            rows={5}
            defaultValue={formState.enterdValues?.body}
          ></textarea>
        </p>

        <div className="errors">
          <ul>
            {formState.errors &&
              formState.errors.map((err) => {
                return <li key={err}>{err}</li>;
              })}
          </ul>
        </div>
        <Submit/>
      </form>
    </div>
  );
}
