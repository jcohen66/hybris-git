<!DOCTYPE html>
<html>
<head>
    <title>E2E Tests</title>
    <script src="/buildArtifacts/static-resources/dist/smartedit/js/thirdparties.js"></script>
    <link rel="stylesheet" href="/buildArtifacts/static-resources/dist/smartedit/css/outer-styling.css">
</head>
<body>
    <script>
        var items = {{items}};
        items.unshift({
            key: 'application index'
        });

        function prettyPrint(ugly) {
            if (ugly) {
                return JSON.stringify(ugly, undefined, 4);
            }
            return ugly;
        }

    </script>
    <script type="text/template" id="testListTpl">
        <div class="container">
            <table class="table table-striped table-condensed">
            <%
                _.each(items, function(item) {
            %>
            <tr>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-default btn-sm dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true">
                            <span class="glyphicon glyphicon-th-list" aria-hidden="true"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li><textarea cols=150 rows=10 disabled><%= prettyPrint(item.data) %></textarea></li>
                        </ul>
                    </div>
                </td>
                <td class="col col-lg-11">
                    <a data-key="<%= item.key %>"><h5><%= item.key %></h5></a>
                </td>
            </tr>
            <%
                });
            %>
            </table>
        </div>
    </script>

    <!-- placeholder for e2e list -->
    <div id="testList"></div>

    <script>
        var template = $("#testListTpl").html();
        $("#testList").html(_.template(template, {items: items}));

        $('a').click(function(e) {
            e.preventDefault();
            goToTest(e.currentTarget.dataset.key);
        });

        function goToTest(key) {
            var item = items.find(item => item.key === key);
            if (item.data && item.data.jsFiles && item.data.jsFiles.length) {
                sessionStorage.setItem("additionalTestJSFiles", JSON.stringify(item.data.jsFiles));
            } else {
                sessionStorage.removeItem("additionalTestJSFiles");
            }
            window.location.replace('app.html');
        }
    </script>
</body>
</html>