import * as quiz from ".";

describe("Quiz", () => {
  it("gets correct products", async () => {
    const skinType = "mixed";
    const goals = ["wrinkles", "acne", "dehydrated"];

    const result = quiz.recommendedProductsList(skinType, goals);
    expect(result["cream-my-skin"].sku).toBe("SKU-cream-antioxidant");
  });

  it("gets correct order of skus", async () => {
    const skinType = "mixed";
    const goals = ["wrinkles", "acne", "dehydrated", "edema", "body"];

    const result = quiz.quiz2skuList(skinType, goals);

    expect(result).toStrictEqual([
      "SKU-cream-antioxidant",
      "SKU-flower-powder",
      "SKU-oil-normal-mixed-oily",
      "SKU-exfoliate",
      "SKU-cream-my-body",
      "brush-my-body",
      //"SKU-clean-my-skin",
      /*   "Video-FaceMassage-Level1",
      "Video-Limfa-Level2",
      "Video-Level8-taping", */
    ]);
  });
});

/*
function testAllQuizCombinations() {
    var possibleGoals = ['sensitive', 'wrinkles', 'dehydrated', 'acne', 'pimple', 'lighten'];
    var possibleSkinTypes = ['normal', 'dry', 'oily', 'mixed'];

    var goalsCombos = [];
      for (i = 0; i < possibleGoals.length; i++) {
           goalsCombos.push([possibleGoals[i]]);
           for (j = i; j < possibleGoals.length; j++) {
              if (i == j || i == j+1) continue;

              var concat2 = possibleGoals.slice(i+1,j+1);
              //console.log(concat2);
              goalsCombos.push([possibleGoals[i]].concat(concat2));
           }
      }
      //console.log(goalsCombos.length);
      //console.log(goalsCombos);

      var productsCombo = [];
      var skinTypeandGoalCombo = [];

      possibleSkinTypes.forEach(function(skinType) {
       // console.log(skinType);
        goalsCombos.forEach(function(goals) {
           //console.log(skinType + " " + goals);
           var products = quiz2Products(skinType, goals);

           var productArray = [];
           if (products.cream.count > 0) productArray.push("cream");
           if (products.powder.count > 0) productArray.push("powder");
           if (products.oil.count > 0) productArray.push("oil");
           if (products.exfoliate.count > 0) productArray.push("exfoliat");

           var productsComboIndex = productsCombo.indexOf(productArray.toString());

           if (productsComboIndex == -1) {
             productsCombo.push(productArray.toString())
             skinTypeandGoalCombo.push([]);
           } else {
             skinTypeandGoalCombo[productsComboIndex].push(skinType + " " + goals);
           }


           console.log(productArray);
           console.log(skinType + " " + goals);
           console.log("----");
        });
      });

      for (i = 0; i < productsCombo.length; i++) {
         console.log(productsCombo[i]);
         for (j =0; j< skinTypeandGoalCombo[i].length; j++) {
            console.log(skinTypeandGoalCombo[i][j]);
         }
         console.log("----");
        }

  }
  */
