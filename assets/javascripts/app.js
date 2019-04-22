$(function () {
    var deg = Math.PI / 180;

    var canvas = document.getElementById("canvas_Launch");
    var canvas_width = canvas.offsetWidth;
    var canvas_halfWidth = canvas_width / 2;
    var canvas_height = canvas.offsetHeight;
    var canvas_halfHeight = canvas_height / 2;
    var canvas_shortSide = canvas_width < canvas_height ? cavnas_width : canvas_height;
    var canvas_halfShortSide = canvas_shortSide / 2;

    var arcRadius = canvas_halfShortSide - 10;
    var textPosition = canvas_halfShortSide / 2;

    var context = canvas.getContext("2d");
    context.translate(canvas_halfWidth, canvas_halfHeight);
    // restaurantList should get from server
    // var restaurantList = ["東野日式料理", "絕代雙驕", "羊肉麵線", "八方雲集", "悟饕便當", "肉圓", "美而美早餐店", "老五", "雲吞/咖哩飯", "丼飯", "麥當勞", "摩斯", "該找找新的了..."];
    var restaurantList = ["福州乾拌麵", "麥當勞", "燒臘", "牛肉麵", "漢堡王", "蚵仔麵線", "池上飯包", "湯包大餛飩", "自助餐", "麵食館", "三商巧福", "鮮五丼", "鬍鬚張", "PizzaHut", "該找找新的了..."];
    var colorList = genColorList(restaurantList);
    // render init
    drawArcAndText();
    drawArrow();
    var t = null;
    var angle = 0;

    $("#btn_Start").click(function () {
        $("#btn_Start").attr("disabled", true);
        $("#btn_AddRestaurant").attr("disabled", true);

        if (t) { return false };

        var step = 30 + Math.random() * 1000;
        // 轉吧!!!
        t = setInterval(function () {
            // 停下來的門檻
            if (step <= 0.02) {
                clearInterval(t);
                t = null;
                $("#btn_Start").attr("disabled", false);
                $("#btn_AddRestaurant").attr("disabled", false);
                var finalRestaurantIndex = Math.floor((360 - angle) / (360 / restaurantList.length));
                if (confirm("今天想吃 " + restaurantList[finalRestaurantIndex] + " 嗎?")) {
                    // send result to server
                } else {
                    // do nothing
                    restaurantList.splice(finalRestaurantIndex, 1);
                    colorList = genColorList(restaurantList);
                    context.save();
                    context.rotate(angle * deg);
                    drawArcAndText();
                    context.restore();
                    drawArrow();
                }
            } else {
                angle += step;
                if (angle > 360) {
                    angle -= 360;
                }
                context.clearRect(-canvas_halfWidth, -canvas_halfHeight, canvas_width, canvas_height); // clean up every frame
                context.save();
                context.rotate(angle * deg);
                drawArcAndText();
                context.restore();
                drawArrow();
            }
            step *= 0.975; // reduce speed
        }, 13);
    });

    $("#btn_AddRestaurant").click(function () {
        var restaurant = prompt("請輸入餐廳名稱", "");
        if (restaurant != null) {
            restaurantList.push(restaurant);
            colorList = genColorList(restaurantList);
            drawArcAndText();
            drawArrow();
        }
    });

    function drawArcAndText() {
        var splitDegree = 360 / restaurantList.length * deg;
        for (var i = 0; i < restaurantList.length; i++) {
            drawArc(0, 0, arcRadius, i * splitDegree, (i + 1) * splitDegree, colorList[i]);
            context.save();
            drawText(textPosition, 0, 0, i * splitDegree + 0.5 * splitDegree, restaurantList[i]);
            context.restore();
        }
    }

    function drawArrow() {
        context.beginPath();
        context.fillStyle = "#000000";
        context.moveTo(135, 0);
        context.lineTo(canvas_halfHeight, 12);
        context.lineTo(canvas_halfHeight, -12);
        context.closePath();
        context.fill();
    }


    function drawArc(x, y, radius, sDeg, eDeg, color) {
        context.beginPath();
        context.moveTo(x, y);
        context.fillStyle = color;
        context.arc(x, y, radius, sDeg, eDeg);
        context.fill();
        context.closePath();
    }

    function drawText(x, y, radius, rotate, text) {
        context.fillStyle = "#222222";
        context.rotate(rotate);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "14px 微軟正黑體";
        context.fillText(text, x, y);
    }

    function genColorList(list) {
        return list.map(function (value, index, array) {
            return genHSL(array.length, index);
        });
    }

    function genHSL(length, n) {
        return "hsl(" + n * 360 / length + ",100%,75%)";
    }
});