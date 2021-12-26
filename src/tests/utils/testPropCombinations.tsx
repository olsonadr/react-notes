// Gets the combinations of elements in passed arrays
// Source: https://newbedev.com/javascript-generate-all-combinations-of-elements-in-multiple-arrays-javascript-code-example
function cartesian(...args:any[]) {
  var r:any[] = [],
    max = args.length - 1;
  function helper(arr:any[], i:number) {
    for (var j = 0, l = args[i].length; j < l; j++) {
      var a = arr.slice(0); // clone arr
      a.push(args[i][j]);
      if (i === max) r.push(a);
      else helper(a, i + 1);
    }
  }
  helper([], 0);
  return r;
}

// Takes an object of properties and their possible values,
// and runs a passed function that uses those properties
// with all the possible combinations of those property values
const testPropCombinations = (
  propCombs: { [key: string]: any[] },
  callback: (props: { [key: string]: any }) => void
) => {
  // Get all combinations
  const combs = cartesian(propCombs);

  // For each combination, call the provided function
  combs.forEach(propVals => {
    // propVals has the values in the order of the attribs, create object
    let props:{[key:string]:any} = {};
    propCombs.keys.forEach((key:string, idx:number) => {
      props[key] = propVals[idx];
    });
    // Call callback with these props, then move on
    callback(props);
  });
};

export default testPropCombinations;
