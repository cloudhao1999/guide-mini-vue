export function shouldUpdateComponent(prevVnode, nextVnode) {
    const { props: prevProps } = prevVnode;
    const { props: nextProps } = nextVnode;

    for (const key in nextProps) {
        if (prevProps[key] !== nextProps[key]) {
            return true;
        }
    }

    return false;
}