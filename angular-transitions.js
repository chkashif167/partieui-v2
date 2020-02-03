export const slider = trigger("routeAnimations", [
  transition("* => *", slideTransition())
]);

function slideTransition() {
  const optional = { optional: true };
  return [
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%"
        })
      ],
      optional
    ),
    query(":enter", [style({ left: "-100%" })]),
    group([
      query(
        ":leave",
        [animate("300ms ease", style({ left: "100%" }))],
        optional
      ),
      query(":enter", [animate("300ms ease", style({ left: "0%" }))])
    ])

    // Run child animations if applicable (i.e. slide in posts on feed)
    // query(':leave', animateChild()),
    // query(':enter', animateChild()),
  ];
}
