type Props = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** A schema.org block. `<` is escaped so no string in the data can close the script element. */
const JsonLd: React.FC<Props> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
  />
);

export default JsonLd;
