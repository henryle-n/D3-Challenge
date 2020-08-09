
const analysisMaster = {
    // Poverty vs. ?
    "PovertyHealthcare" :
        "There is a clear proportional increasing relationship/ trend between Poverty (%) and Lacks Healthcare (%). The higher the poverty, the higher the lack of healthcare, which makes sense as people may not be able to afford expensive health coverage.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>Texas leads <em>Lacks Healthcare</em> category with approx. 1/4 of the population doesn't have healthcare.\
            <li>Massachusetts is the state with best healthcare coverage, only 4.6% of the population lacks healthcare.</li>\
            <li>In terms of <em>Poverty</em> level, New Hampshire has the lowest level, while Mississippi and New Mexico lead this category.</li>\
        </ul>\
        <hr>",

    "PovertySmokes" :
        "Similar to <em>Poverty vs. Lacks Healthcare / Obesity</em>, there is a clear proportional increasing relationship/ trend between Poverty (%) and Smokes (%). The higher the poverty, the higher amount of population smokes.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>West Virginia leads <em>Smokes</em> category with more than 1/4 of the population smokes.\
            <li>In contrast, only approx. 10% of the people smokes in Utah, which also the lowest state with least smoking population.</li>\
            <li>In terms of <em>Poverty</em> level, New Hampshire has the lowest level, while Mississippi and New Mexico lead this category.</li>\
        </ul>\
        <hr>",

    "PovertyObesity": 
        "Similar to <em>Poverty vs. Lacks Healthcare / Smokes</em>, there is a clear proportional increasing relationship/ trend between Poverty (%) and  Obesity(%). The higher the poverty, the higher amount of population is obese.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>Arkansas and West Virginia lead <em>Obesity</em> category with approx. 36% of the population is obese.\
            <li>In contrast, only approx. 22% of the people in Colorado and Washington D.C. is obese, which are also the two lowest state in this category.</li>\
            <li>In terms of <em>Poverty</em> level, New Hampshire has the lowest level, while Mississippi and New Mexico lead this category.</li>\
        </ul>\
        <hr>",

    // Age vs. ?
    "AgeHealthcare": 
        "Upon analyzing the data, there isn't a clear trend/ relationship. It seems to have two different trends: one trend is a proportional relationship and the other is the opposite. However, majority of the data follows the inversely proportional relationship/ trend. Thus, this could be intepreted as the main trend: the younger lacks healthcare more.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>Interestingly enough, the majority of people in poverty are from 37 to 40 years old.</li>\
            <li>Due to the limitation of downloaded data, only age range from 30 to 44 years is analyzed.</li>\
            <li>Texas leads <em>Lacks Healthcare</em> category with approx. 1/4 of the population doesn't have healthcare.\
            <li>Massachusetts is the state with best healthcare coverage, only 4.6% of the population lacks healthcare.</li>\
        </ul>\
        <hr>",

    "AgeSmokes" :
        "In general, there is a proportional increasing relationship/ trend between Age and Smokes(%). The higher the age, the higher amount of population smokes.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>The majority of people that smoke are from 35 to 41 years old, which also the age range where most people are in poverty.</li>\
            <li>West Virginia leads <em>Smokes</em> category with more than 1/4 of the population smokes.\
            <li>In contrast, only approx. 10% of the people smokes in Utah, which also the lowest state with the least smoking population.</li>\
        </ul>\
        <hr>",

    "AgeObesity" :
        "There is no clear relationship/ trend between Age (yrs) and  Obesity(%). The higher the poverty, the higher amount of population smokes.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>The majority of people that smoke are from 35 to 41 years old, which also the age range where most people are in poverty.</li>\
            <li>Arkansas and West Virginia lead <em>Obesity</em> category with approx. 36% of the population is obese.\
            <li>In contrast, only approx. 22% of the people in Colorado and Washington D.C. is obese, which are also the two lowest state in this category.</li>\
        </ul>\
        <hr>",


    // Household Income vs. ?
    "IncomeHealthcare" :
        "Data is spreaded out widely. However, there is a good inversely proportional relationship/ trend between <em>Household ($) vs. Lacks Healthcare (%)</em>, which makes sense as the lower the income is, the less likelihood that people would buy expensive health coverage.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>In this sampled dataset, Maryland leads the income category with average about $74,000/ year per household.</li>\
            <li>In contrast, Mississippi is the state that has lowest income per household with only approx. $40,000/ year per household.</li>\
            <li>Texas leads <em>Lacks Healthcare</em> category with approx. 1/4 of the population doesn't have healthcare.\
            <li>Massachusetts is the state with best healthcare coverage, only 4.6% of the population lacks healthcare.</li>\
            </ul>\
        <hr>",

    "IncomeSmokes" : 
        "There is a clear proportional increasing relationship/ trend between <em>Household Income ($) vs. Smokes (%)</em>. The lower the income (means the higher the poverty), the higher amount of population smokes.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>In this sampled dataset, Maryland leads the income category with average about $74,000/ year per household.</li>\
            <li>In contrast, Mississippi is the state that has lowest income per household with only approx. $40,000/ year per household.</li>\
            <li>West Virginia leads <em>Smokes</em> category with more than 1/4 of the population smokes.\
            <li>In contrast, only approx. 10% of the people smokes in Utah, which also the lowest state with the least smoking population.</li>\
        </ul>\
        <hr>",

    "IncomeObesity" : 
        "Similar to <em>Household Income ($) vs. Smokes (%)</em>, there is a clear proportional increasing relationship/ trend between Household Income ($) and  Obesity(%). The lower the income (means the higher the poverty), the higher amount of population smokes.\
        <br><br> Other observations include:<br>\
        <ul>\
            <li>In this sampled dataset, Maryland leads the income category with average about $74,000/ year per household.</li>\
            <li>In contrast, Mississippi is the state that has lowest income per household with only approx. $40,000/ year per household.</li>\
            <li>Arkansas and West Virginia lead <em>Obesity</em> category with approx. 36% of the population is obese.\
            <li>In contrast, only approx. 22% of the people in Colorado and Washington D.C. is obese, which are also the two lowest state in this category.</li>\
        </ul>\
        <hr>",

}

// declare variables
var analysisTitle;
var analysisContent;
var articleGroup;

// ================== ADD DATA ANALYSIS TO HTML =====================]
function getAnalysis (xAxis, yAxis) {

    // clear previous Data Analysis section
    refreshExistElemt(articleGroup);

    // create new article Group
    articleGroup = d3.select(".article").append("span");
    
    // reformat axes names
    xAxis = xAxis.charAt(0).toUpperCase() + 
    xAxis.slice(1);

    yAxis = yAxis.charAt(0).toUpperCase() + 
    yAxis.slice(1);

    // make title
    analysisTitle = articleGroup
        .append("h1")
        .classed("aTitle", true)
        .text(`${xAxis} vs. ${yAxis}: `)
        .append("hr");
        
    // pull analysis from object and parse onto article area
    currSelect = xAxis.concat(yAxis.charAt(0).toUpperCase() + 
        yAxis.slice(1));

    analysisContent = articleGroup
        .append("p")
        .classed("aContent", true)
        .html(analysisMaster[currSelect]);
}



