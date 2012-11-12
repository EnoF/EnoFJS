describe('class extentions', function () {

    function Parent() {
        var protected = {
            foo: "FOO",
            bar: function () {
                return "BAR";
            },
            override: "WAIT"
        };

        this.protected = protected;
    }
    Parent = Parent.wrap();

    function Child() {
        var protected = {
            food: "FOOD",
            getFooBar: function () {
                return protected.foo + " " + protected.bar();
            },
            override: "DONE"
        };

        this.protected = protected;

        this.getProtected = function () {
            return protected;
        };
    }
    Child = Child.extend(Parent);

    it('should copy protected variables from parent to child', function () {
        var child = new Child();

        expect(child.getProtected().getFooBar()).toEqual("FOO BAR");
    });

    it('should be able to override variables', function () {
        var child = new Child();

        expect(child.getProtected().override).toEqual("DONE");
    });

    it('should hide this.protected variables after extending', function () {
        var child = new Child();

        expect(child.protected).toEqual(undefined);
    });

    it('should hide this.protected variables after wrapping', function () {
        var parent = new Parent();

        expect(parent.protected).toEqual(undefined);
    });
});