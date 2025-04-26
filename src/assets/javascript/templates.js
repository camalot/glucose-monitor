class Templates {

  static find(id) {
    return $(`div[data-type="template"] [data-template="${id}"]`);
  }

  static append(parent, template, renderFunc) {
    const renderedContent = renderFunc(template);

    $(parent).append(renderedContent);

    return renderedContent;
  }

  static remove(parent, selector) {
    $(parent).find(selector).remove();
  }

  static clear(parent) {
    $(parent).empty();
  }

  static render(parent, templateId, data) {
    console.log(`templateId: ${templateId}`);
    console.log(data);
    const template = Templates.find(templateId).clone();

    console.log(template);
    const renderFunc = (clonedTemplate) => {
      console.log("render template");
      /*
        <div data-template="foodSuggestions" data-bind-value-attr="value">
          <img src="..." class="food-suggestion-image mr-2" data-bind="img" data-bind-img-attr="src"/>
          <span class="food-suggestion-name" data-bind="value"></span>
        </div>
      */
      Object.keys(data).forEach(key => {
        console.log(`key: ${key}`);
        // find the `data-bind-attr` attribute and set its text
        const target = clonedTemplate.find(`[data-bind="${key}"]`);
        const targetAttr = target.data(`bind-${key}-attr`);
        if(target) {
          console.log(target);
          if (targetAttr) {
            console.log(`bind: ${targetAttr} => ${data[key]}`);
            target.attr(targetAttr, data[key]);
          } else {
            console.log(`bind: text => ${data[key]}`);
            target.text(data[key]);
          }
        }
      });
      console.log(clonedTemplate);
      return clonedTemplate;
    };
    return Templates.append(parent, template, renderFunc);
  }
}