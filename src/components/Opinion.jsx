import { useContext } from "react";
import { OpinionsContext } from "../store/opinions-context";
import { useActionState } from "react";
import { useOptimistic } from "react";

export function Opinion({ opinion: { id, title, body, userName, votes } }) {
  const { upvoteOpinion, downvoteOpinion } = useContext(OpinionsContext);

  //useOptimistic hook is customhook provided by react to show the result instantly if there is any value
  // which is getting updated after the async call
  const [votesOptimistic, setVoteOptimistically] = useOptimistic(
    votes,
    (prevVote, mode) => {
      return mode === "up" ? prevVote + 1 : prevVote - 1;
    }
  );

  // we want to disable the upvote and downvote button untill the the vote values get updated
  // we will be disableing both upvote and downvote button when voting for the opinion
  const [upvoteFormState, upvoteFormAction, upvotePending] = useActionState(
    upVoteAction,
    null
  );
  const [downvoteFormState, downvoteFormAction, downvotePending] =
    useActionState(downVoteAction, null);

  //just like the formaction we set to the form level. the formAction can also be set to the other tag level
  // in order to submit action  to different different url. Eg below we have scenario to call different url when
  // doing upvote against any opinion and likewise dwonvote against any opinion
  async function upVoteAction() {
    console.log("Upvoting...");
    // this will instantly increase the opinion vote count but the call will still be async and the 
    // prevVote value will we updated with new. If there is any error during the async call the value will be 
    // rollback to its last value which was before updating. 
    setVoteOptimistically("up"); 
    await upvoteOpinion(id);
  }

  async function downVoteAction() {
    console.log("downvoting...");
    setVoteOptimistically("down");
    await downvoteOpinion(id);
  }

  return (
    <article>
      <header>
        <h3>{title}</h3>
        <p>Shared by {userName}</p>
      </header>
      <p>{body}</p>
      <form className="votes">
        <button
          formAction={upvoteFormAction}
          disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </button>

        <span>{votesOptimistic}</span>

        <button
          formAction={downvoteFormAction}
          disabled={upvotePending || downvotePending}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="m8 12 4 4 4-4" />
          </svg>
        </button>
      </form>
    </article>
  );
}
