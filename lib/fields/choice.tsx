import React, { Component } from 'react';
import { FormGroup, FormText, Input } from 'reactstrap';
// eslint-disable-next-line import/no-cycle
import Field from './field';
import { ChoiceDefinition } from './schema';

// Interfaces
interface ChoiceFieldProps {
  def: ChoiceDefinition;
  name: string;
  optChange: (name: string, val: any, ai?: boolean | number) => void;
  required?: boolean;
  parent?: string;
}

interface ChoiceFieldState {
  selected: string;
}

// Component
class ChoiceField extends Component<ChoiceFieldProps, ChoiceFieldState> {
  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    name: 'Choice',
    parent: ''
  }

  constructor(props: ChoiceFieldProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      selected: ''
    };
  }

  getParent() {
    const { name, parent } = this.props;

    let rtn = '';
    if (parent) {
      rtn = [parent, name].join('.');
    } else if (name && /^[a-z]/.exec(name)) {
      rtn = name;
    }
    return rtn;
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      selected: e.target.value
    }, () => {
      const { optChange } = this.props;
      const { selected } = this.state;

      optChange(this.getParent(), selected);
    });
  }

  render() {
    const {
      def, name, optChange, required
    } = this.props;
    const { selected } = this.state;

    const defOpts: Array<JSX.Element> = [];
    if ('properties' in def) {
      defOpts.push(...Object.keys(def.properties).map(field => {
        const d = def.properties[field];
        return (<option key={field} data-subtext={d.description || ''} value={field}>{field}</option>);
      }));
    }

    if ('patternProperties' in def) {
      // TODO: Pattern Properties
      console.warn('Choice Pattern Props', def.patternProperties);
    }

    let selectedDef: undefined | JSX.Element;
    if (selected) {
      selectedDef = (
        <Field
          key={selected}
          def={def.properties[selected] || {}}
          optChange={optChange}
          name={selected}
          parent={this.getParent()}
          required
        />
      );
    }

    return (
      <FormGroup>
        <h4>{name}{required ? <span style={{ color: 'red' }}>*</span> : ''}</h4>
        {def.description ? <FormText color="muted">{def.description}</FormText> : ''}
        <div className="col-12 my-1 px-0">
          <Input type="select" name={name} title={name} className="selectpicker" onChange={this.handleChange}>
            <option data-subtext={`${name} options`} value='' >{`${name} options`}</option>
            {defOpts}
          </Input>

          <div className="col-12 py-2">
            {selectedDef}
          </div>
        </div>
      </FormGroup>
    );
  }
}

export default ChoiceField;
